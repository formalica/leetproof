---
slug: "implies-transitivity"
title: "Implies Transitivity"
difficulty: "easy"
tags: ["logic", "implication", "tactics"]
sort_order: 3
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (implies_trans : (P Q R : Prop) → (P → Q) → (Q → R) → P → R)

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``implies_trans
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := []
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"
starter_code: |
  theorem implies_trans (P Q R : Prop) (hpq : P → Q) (hqr : Q → R) : P → R := by
    sorry
---



Prove that implication is transitive: if `P → Q` and `Q → R`, then `P → R`.

<br>

<details>
<summary>References</summary>

[`Function.comp`](https://leanprover-community.github.io/mathlib4_docs/Init/Prelude.html#Function.comp)

</details>

<details>
<summary>Related Problems</summary>

[Or is Commutative](/problems/or-commutative)

[And Introduction](/problems/and-introduction)

</details>
