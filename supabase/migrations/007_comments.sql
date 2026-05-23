-- ============================================
-- Comments & Comment Likes Migration
-- Adds comment system for solutions
-- Idempotent: safe to run multiple times
-- ============================================

-- Comments on solutions (top-level and replies)
CREATE TABLE IF NOT EXISTS public.solution_comments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  solution_id uuid REFERENCES public.solutions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES public.solution_comments(id) ON DELETE CASCADE,
  reply_to_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  content text NOT NULL,
  is_edited boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Comment likes: one like per user per comment
CREATE TABLE IF NOT EXISTS public.comment_likes (
  comment_id uuid REFERENCES public.solution_comments(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (comment_id, user_id)
);

-- ============================================
-- RLS: solution_comments
-- ============================================
ALTER TABLE public.solution_comments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Comments viewable by everyone"
    ON public.solution_comments FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own comments"
    ON public.solution_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own comments"
    ON public.solution_comments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own comments"
    ON public.solution_comments FOR DELETE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- RLS: comment_likes
-- ============================================
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Comment likes viewable by everyone"
    ON public.comment_likes FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own comment likes"
    ON public.comment_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own comment likes"
    ON public.comment_likes FOR DELETE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_solution_comments_solution ON public.solution_comments(solution_id);
CREATE INDEX IF NOT EXISTS idx_solution_comments_parent ON public.solution_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_solution_comments_user ON public.solution_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON public.comment_likes(comment_id);
