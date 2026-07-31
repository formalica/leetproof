---
slug: "set-of-two-equal-elements"
title: "Set of Two Equal Elements"
difficulty: "easy"
tags: ["logic", "set"]
sort_order: 26
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (pair_eq_singleton : ∀ {α : Type} {u v w : α},
    ({u, v} : Set α) = {w} → u = w ∧ v = w)

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``pair_eq_singleton
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := [``propext, ``Classical.choice, ``Quot.sound]
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"
starter_code: |
  import Mathlib.Data.Set.Basic 

  theorem pair_eq_singleton {α : Type} {u v w : α}
      (h : {u, v} = ({w} : Set α)) : u = w ∧ v = w := by
    sorry
---

Suppose the set containing the two elements `u` and `v` is equal to the singleton set containing `w`.
Prove that both elements are equal to `w`:
