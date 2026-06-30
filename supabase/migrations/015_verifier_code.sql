-- ============================================
-- Verifier Code Migration
-- Adds per-problem verifier_code (Lean verification template) to problems.
-- The template's import header is placed first, the user's solution is
-- spliced in (at the {{SOLUTION}} placeholder, or after the import header),
-- and the remaining checks are appended at the end.
-- Idempotent: safe to run multiple times.
-- ============================================

DO $$ BEGIN
  ALTER TABLE public.problems ADD COLUMN verifier_code text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;
