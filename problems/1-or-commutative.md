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

  #eval show Lean.CoreM Unit from do
    let thmName := ``or_commutative
    let forbiddenName := ``Or.comm
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
  theorem or_commutative (P Q : Prop) : P ∨ Q → Q ∨ P := by
    sorry
---
 


Prove that disjunction (logical OR) is commutative: `P ∨ Q → Q ∨ P`.

**Note:** You cannot use automated tactics like `apply?`, `grind`, or `simp`. Additionally, using the exact same alternative of this theorem from libraries is not allowed.

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
