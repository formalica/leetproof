---
slug: "false-implies-anything"
title: "False Implies Anything"
difficulty: "easy"
tags: ["basics", "logic"]
sort_order: 5
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (false_implies_anything : False → 1 = 2)

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``false_implies_anything
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := []
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"

  #eval show Lean.CoreM Unit from do
    let thmName := ``false_implies_anything
    let forbiddenName := ``False.elim
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
  theorem false_implies_anything : False → 1 = 2 := by
    sorry
---


In classical logic, from `False` you can prove anything, even contradictions like `1 = 2`. This is known as the principle of explosion (ex falso quodlibet).

**Note:** You cannot use automated tactics like `apply?`, `grind`, or `simp`. Additionally, using the exact same alternative of this theorem from libraries is not allowed.

<br>
<details>

<summary>References</summary>

[`False.elim`](https://leanprover-community.github.io/mathlib4_docs/Init/Prelude.html#False.elim)

</details>

<details>
<summary>Related Problems</summary>

[Double Negation Elimination](/problems/double-neg-elim)

</details> 
