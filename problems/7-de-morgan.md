---
slug: "de-morgan"
title: "De Morgan's Law"
difficulty: "easy"
tags: ["logic", "negation"]
sort_order: 7
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (de_morgan : (P Q : Prop) → ¬(P ∨ Q) → ¬P ∧ ¬Q)

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``de_morgan
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := [``propext]
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"
starter_code: |
  theorem de_morgan (P Q : Prop) : ¬(P ∨ Q) → ¬P ∧ ¬Q := by
    sorry
---
 


Prove that `¬(P ∨ Q) → ¬P ∧ ¬Q`.

This is one direction of De Morgan's Law. Note that this direction is provable constructively (no need for classical logic).

<br>
<details>

<summary>References</summary>

[`not_or`](https://leanprover-community.github.io/mathlib4_docs/Mathlib/Logic/Basic.html#not_or)

</details>

<details>
<summary>Related Problems</summary>

[Double Negation Elimination](/problems/double-neg-elim)  
[Or is Commutative](/problems/or-commutative)  
[And Introduction](/problems/and-introduction)

</details>
