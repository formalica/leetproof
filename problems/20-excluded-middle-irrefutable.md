---
slug: "excluded-middle-irrefutable"
title: "Excluded Middle is Irrefutable"
difficulty: "easy"
tags: ["logic"]
sort_order: 20
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (excluded_middle_irrefutable : (P : Prop) → ¬¬(P ∨ ¬P))

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``excluded_middle_irrefutable
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := [``propext]
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"

  #eval show Lean.CoreM Unit from do
    let thmName := ``excluded_middle_irrefutable
    let forbiddenName := ``not_not_em
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
  theorem excluded_middle_irrefutable (P : Prop) : ¬¬(P ∨ ¬P) := by
    sorry
---
 


Prove that the law of excluded middle is **irrefutable**: `¬¬(P ∨ ¬P)`.

Even though `P ∨ ¬P` cannot be proven constructively in general, its double negation can — this shows that rejecting excluded middle leads to a contradiction, so it is always "safe" to assume classically.

**Note:** You cannot use classical axioms and automated tactics like `apply?`, `grind`, or `simp`. Additionally, using the exact same alternative of this theorem from libraries is not allowed.

<br>
<details>

<summary>References</summary>

[`not_not_em`](https://leanprover-community.github.io/mathlib4_docs/Init/PropLemmas.html#not_not_em)

</details>

<details>
<summary>Related Problems</summary>

[De Morgan's Law](/problems/de-morgan)  
[Double Negation Elimination](/problems/double-neg-elim)  

</details>
