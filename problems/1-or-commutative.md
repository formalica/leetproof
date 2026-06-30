---
slug: "or-commutative"
title: "Or is Commutative"
difficulty: "easy"
tags: ["basics", "logic"]
sort_order: 1
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (or_commutative : (P Q : Prop) → P ∨ Q → Q ∨ P)

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``or_commutative
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := []
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"
starter_code: |
  theorem or_commutative (P Q : Prop) : P ∨ Q → Q ∨ P := by
    sorry
---
 


Prove that disjunction (logical OR) is commutative: `P ∨ Q → Q ∨ P`.

---
<details>
<summary>References</summary>

[`Or.comm`](https://leanprover-community.github.io/mathlib4_docs/Init/Prelude.html#Or.comm)

</details>

<details>
<summary>Related Problems</summary>

[And Introduction](/problems/and-introduction)  
[Implies Transitivity](/problems/implies-transitivity)

</details>
