-- Add version column to submissions
DO $$ BEGIN
  ALTER TABLE public.submissions ADD COLUMN version text NOT NULL DEFAULT 'mathlib-v4.28.0';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add version column to solutions
DO $$ BEGIN
  ALTER TABLE public.solutions ADD COLUMN version text NOT NULL DEFAULT 'mathlib-v4.28.0';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Add is_public column to hint_packs (default true for backward compat)
DO $$ BEGIN
  ALTER TABLE public.hint_packs ADD COLUMN is_public boolean NOT NULL DEFAULT true;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Update RLS: hint packs visible if public OR user is owner
DROP POLICY IF EXISTS "Hint packs viewable by everyone" ON public.hint_packs;
DO $$ BEGIN
  CREATE POLICY "Hint packs viewable if public or own"
    ON public.hint_packs FOR SELECT
    USING (is_public = true OR auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
