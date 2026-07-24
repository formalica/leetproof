---
slug: "22-find-function"
title: "Find Function: f (f x + f y) = x + y"
difficulty: "hard"
tags: ["functions"]
sort_order: 22
verifier_code: |
  import Lean
  
  {{SOLUTION}}

  #check (f_impl : Nat → Nat)
  #check (f_solution : (f : Nat → Nat) → (∀ x y, f (f x + f y) = x + y) → f = f_impl)

  #guard f_impl 0 = 0
  #guard f_impl 1 = 1
  #guard f_impl 5 = 5

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``f_solution
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := [``propext, ``Classical.choice, ``Quot.sound]
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"

starter_code: |

  def f_impl (n : Nat) : Nat := sorry

  theorem f_solution (f : Nat → Nat) :
      (∀ x y, f (f x + f y) = x + y) → f = f_impl := by
    sorry
---

Find `f : Nat → Nat` such that `∀ x y, f (f x + f y) = x + y`. Define it as `f_impl` and prove uniqueness: any such `f` equals `f_impl`.
