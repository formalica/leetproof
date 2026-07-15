---
slug: "de-morgan"
title: "De Morgan's Law"
difficulty: "easy"
tags: ["logic"]
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

  #eval show Lean.CoreM Unit from do
    let thmName := ``de_morgan
    let forbiddenName := ``not_or
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
  theorem de_morgan (P Q : Prop) : ¬(P ∨ Q) → ¬P ∧ ¬Q := by
    sorry
---
 


Prove that `¬(P ∨ Q) → ¬P ∧ ¬Q`.

This is one direction of De Morgan's Law. Note that this direction is provable constructively (no need for classical logic).

**Note:** You cannot use classical axioms and automated tactics like `apply?`, `grind`, or `simp`. Additionally, using the exact same alternative of this theorem from libraries is not allowed.

<br>
<details>

<summary>References</summary>

[`not_or`](https://leanprover-community.github.io/mathlib4_docs/Init/PropLemmas.html#not_or)

</details>

<details>
<summary>Related Problems</summary>

[Double Negation Elimination](/problems/double-neg-elim)  
[Or is Commutative](/problems/or-commutative)  
[And Introduction](/problems/and-introduction)  
[Excluded Middle is Irrefutable](/problems/excluded-middle-irrefutable)

</details>
