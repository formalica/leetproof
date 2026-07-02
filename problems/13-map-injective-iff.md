---
slug: "map-injective-iff"
title: "Map Preserves Injectivity"
difficulty: "medium"
tags: ["list", "induction", "functions"]
sort_order: 13
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (map_injective_iff : {α β: Sort _} → (f : α → β) → (Function.Injective f ↔ Function.Injective (List.map f)))

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``map_injective_iff
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := [``propext, ``Classical.choice, ``Quot.sound]
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"

  #eval show Lean.CoreM Unit from do
    let thmName := ``map_injective_iff
    let forbiddenName := ``List.map_injective_iff
    let env ← Lean.getEnv
    if let some decl := env.find? thmName then
      let proofTerm? := match decl with
        | .thmInfo info  => some info.value
        | .defnInfo info => some info.value
        | _              => none
      if let some proof := proofTerm? then
        if (proof.find? fun e => e.isConstOf forbiddenName).isSome then
          throwError s!"using {forbiddenName} is not allowed in {thmName}"
starter_code: |
  theorem map_injective_iff (f : α → β) :
      Function.Injective f ↔ Function.Injective (List.map f) := by
    sorry
---



Prove that a function is injective if and only if mapping it over lists is injective:

$$\hspace{2em} \text{Injective}(f) \iff \text{Injective}(\text{map}\ f)$$

**Note:** Using the exact same alternative of this theorem from libraries is not allowed.

<br>
<details>

<summary>References</summary>

[`List.map_injective_iff`](https://leanprover-community.github.io/mathlib4_docs/Mathlib/Data/List/Basic.html#List.map_injective_iff)

</details>
