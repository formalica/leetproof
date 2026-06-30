---
slug: "and-introduction"
title: "And Introduction"
difficulty: "easy"
tags: ["basics", "logic"]
sort_order: 2
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (and_intro : (p : Prop) → (q : Prop) → p → q → p ∧ q)

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``and_intro
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := []
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"
starter_code: |
  theorem and_intro (p : Prop) (q : Prop) (hp : p) (hq : q) : p ∧ q := by
    sorry
---



Given propositions `P` and `Q`, and proofs `hp : P` and `hq : Q`, prove `P ∧ Q`.

<br>

<details>
<summary>References</summary>

[`And.intro`](https://leanprover-community.github.io/mathlib4_docs/Init/Prelude.html#And.intro)

</details>

<details>
<summary>Related Problems</summary>

[Or is Commutative](/problems/or-commutative)  
[Implies Transitivity](/problems/implies-transitivity)

</details>
