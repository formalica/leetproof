---
slug: "implies-transitivity"
title: "Implies Transitivity"
difficulty: "easy"
tags: ["basics", "logic"]
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

  #eval show Lean.CoreM Unit from do
    let thmName := ``implies_trans
    let forbiddenName := ``Function.comp
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
  theorem implies_trans (P Q R : Prop) (hpq : P → Q) (hqr : Q → R) : P → R := by
    sorry
---



Prove that implication is transitive: if `P → Q` and `Q → R`, then `P → R`.

**Note:** You cannot use automated tactics like `apply?`, `grind`, or `simp`. Additionally, using the exact same alternative of this theorem from libraries is not allowed.

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
