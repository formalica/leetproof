-- ============================================
-- Drop Legacy Verification Fields Migration
-- Removes main_theorem_name, theorem_type, and allowed_axioms from problems.
-- These are superseded by the per-problem verifier_code template.
-- Idempotent: safe to run multiple times.
-- ============================================

ALTER TABLE public.problems DROP COLUMN IF EXISTS main_theorem_name;
ALTER TABLE public.problems DROP COLUMN IF EXISTS theorem_type;
ALTER TABLE public.problems DROP COLUMN IF EXISTS allowed_axioms;
