---
slug: "double-neg-elim"
title: "Double Negation Elimination"
difficulty: "easy"
tags: ["logic", "classical"]
sort_order: 9
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (not_not : (P : Prop) → ¬¬P → P)

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``not_not
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := [``propext, ``Classical.choice, ``Quot.sound]
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"

  #eval show Lean.CoreM Unit from do
    let thmName := ``not_not
    let forbiddenName := ``Classical.not_not
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
  theorem not_not (P : Prop) : ¬¬P → P := by
    sorry
---



Prove **double negation elimination**: `¬¬P → P`.

**Note:** You cannot use automated tactics like `apply?`, `grind`, or `simp`. Additionally, using the exact same alternative of this theorem from libraries is not allowed.

<br>
<details>

<summary>References</summary>

[`Classical.not_not`](https://leanprover-community.github.io/mathlib4_docs/Mathlib/Logic/Basic.html#Classical.not_not)

</details>

<details>
<summary>Related Problems</summary>

[False Implies Anything](/problems/false-implies-anything)  
[De Morgan's Law](/problems/de-morgan)

</details>
