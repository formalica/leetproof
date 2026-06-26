-- ============================================
-- Profile usernames and public aggregate stats
-- Idempotent: safe to run multiple times
-- ============================================

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN username text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN auth_email text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

CREATE OR REPLACE FUNCTION public.normalize_profile_username(raw_username text, fallback_id uuid)
RETURNS text AS $$
DECLARE
  normalized text;
BEGIN
  normalized := lower(regexp_replace(coalesce(nullif(trim(raw_username), ''), 'user'), '[^a-z0-9._-]', '_', 'g'));
  normalized := regexp_replace(normalized, '_+', '_', 'g');
  normalized := trim(both '_' from normalized);

  IF length(normalized) < 3 THEN
    normalized := normalized || '_' || replace(left(fallback_id::text, 8), '-', '');
  END IF;

  RETURN left(normalized, 40);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.generate_unique_profile_username(raw_username text, profile_id uuid)
RETURNS text AS $$
DECLARE
  base_username text;
  candidate text;
  suffix int := 0;
BEGIN
  base_username := public.normalize_profile_username(raw_username, profile_id);
  candidate := base_username;

  WHILE EXISTS (
    SELECT 1 FROM public.profiles
    WHERE lower(username) = lower(candidate)
      AND id <> profile_id
  ) LOOP
    suffix := suffix + 1;
    candidate := left(base_username, greatest(3, 40 - length(suffix::text) - 1)) || '_' || suffix::text;
  END LOOP;

  RETURN candidate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

UPDATE public.profiles
SET auth_email = email
WHERE auth_email IS NULL
  AND email IS NOT NULL;

UPDATE public.profiles
SET username = public.generate_unique_profile_username(split_part(coalesce(email, id::text), '@', 1), id)
WHERE username IS NULL;

DO $$ BEGIN
  ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_username_format
  CHECK (username IS NULL OR username ~ '^[a-z0-9._-]{3,40}$');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username_lower
  ON public.profiles (lower(username))
  WHERE username IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_auth_email
  ON public.profiles (auth_email)
  WHERE auth_email IS NOT NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  raw_username text;
  profile_email text;
  resolved_auth_email text;
BEGIN
  resolved_auth_email := new.email;
  profile_email := nullif(new.raw_user_meta_data->>'profile_email', '');

  IF profile_email IS NULL AND resolved_auth_email !~* '@users\.leetproof\.local$' THEN
    profile_email := resolved_auth_email;
  END IF;

  raw_username := coalesce(
    nullif(new.raw_user_meta_data->>'username', ''),
    nullif(new.raw_user_meta_data->>'user_name', ''),
    nullif(new.raw_user_meta_data->>'preferred_username', ''),
    split_part(coalesce(profile_email, resolved_auth_email, new.id::text), '@', 1)
  );

  INSERT INTO public.profiles (id, email, auth_email, username, full_name, avatar_url)
  VALUES (
    new.id,
    profile_email,
    resolved_auth_email,
    public.generate_unique_profile_username(raw_username, new.id),
    nullif(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', raw_username), ''),
    nullif(coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'), '')
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DO $$ BEGIN
  CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE OR REPLACE FUNCTION public.get_user_difficulty_stats(profile_user_id uuid)
RETURNS TABLE(difficulty text, total_count bigint, solved_count bigint) AS $$
  WITH difficulty_order(rank, difficulty) AS (
    VALUES (1, 'easy'), (2, 'medium'), (3, 'hard')
  ),
  accepted_problems AS (
    SELECT DISTINCT problem_id
    FROM public.submissions
    WHERE user_id = profile_user_id
      AND status = 'accepted'
  )
  SELECT
    difficulty_order.difficulty,
    count(problems.id) AS total_count,
    count(accepted_problems.problem_id) AS solved_count
  FROM difficulty_order
  LEFT JOIN public.problems
    ON public.problems.difficulty = difficulty_order.difficulty
  LEFT JOIN accepted_problems
    ON accepted_problems.problem_id = public.problems.id
  GROUP BY difficulty_order.rank, difficulty_order.difficulty
  ORDER BY difficulty_order.rank;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_user_difficulty_stats(uuid) TO anon, authenticated;