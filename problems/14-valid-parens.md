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

  #guard isValidParens [] = true 
  #guard isValidParens ['(', ')'] = true 
  #guard isValidParens ['(', ')', ')'] = false 
  #guard isValidParens ['(', '(', ')', ')'] = true 
  #guard isValidParens ['(', 'a', ')'] = true 
  #guard isValidParens ['a', 'b'] = true 
  #guard isValidParens ['(', ')', 'a'] = true 
  #guard isValidParens ['(', '}', ')'] = true 
  #guard isValidParens [')', 'a', '('] = false 

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

  example: isValidParens [] = true := by sorry
  example: isValidParens ['(', ')', 'a'] = true := by sorry
  example: isValidParens ['(', ')', ')'] = false := by sorry
  example: isValidParens ['(','}',')'] = true := by sorry

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

