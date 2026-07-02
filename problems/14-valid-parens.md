---
slug: "valid-parentheses"
title: "Valid Parentheses"
difficulty: "hard"
tags: ["list", "induction", "string", "program-verification"]
sort_order: 14
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (valid_parens_correct : (s : List Char) → (isValidParens s = true ↔ ValidParens s))

  example : isValidParens [] = true := rfl
  example : isValidParens ['(', ')'] = true := rfl
  example : isValidParens ['(', ')', ')'] = false := rfl
  example : isValidParens ['(', '(', ')', ')'] = true := rfl
  example : isValidParens ['(', 'a', ')'] = true := rfl
  example : isValidParens ['a', 'b'] = true := rfl
  example : isValidParens ['(', ')', 'a'] = true := rfl
  example : isValidParens ['(', '}', ')'] = true := rfl

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``valid_parens_correct
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := [``propext, ``Classical.choice, ``Quot.sound]
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"
starter_code: |
  inductive ValidParens : List Char → Prop where
    -- define ValidParens inductivelly 

  def isValidParens (s : List Char) : Bool := sorry

  example: isValidParens [] = true := by rfl
  example: isValidParens ['(', ')', 'a'] = true := by rfl
  example: isValidParens ['(', ')', ')'] = false := by rfl
  example: isValidParens ['(','}',')'] = true := by rfl

  theorem valid_parens_correct : ∀ s, isValidParens s = true ↔ ValidParens s := by
    sorry
---

## Valid Parentheses

Determine if a list of characters (which may contain `'('`, `')'`, and other characters) represents a valid parentheses sequence.


An input list is valid if (considering only the parentheses characters, skip other characters):
- Open brackets must be closed by the same type of brackets
- Open brackets must be closed in the correct order
- Every close bracket has a corresponding open bracket of the same type

### Examples

- `[]` → valid (empty)
- `['(', ')']` → valid
- `['(', ')', ')']` → invalid (extra closing bracket)
- `['(', '(', ')', ')']` → valid (nested pairs)
- `['(', 'a', ')']` → valid (other characters are ignored)
- `['a', 'b']` → valid (no parentheses to check)

