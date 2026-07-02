---
slug: "nat-add-comm"
title: "Addition is Commutative"
difficulty: "easy"
tags: ["natural-numbers", "induction", "arithmetic"]
sort_order: 12
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (add_comm : (m n : Nat) → m + n = n + m)

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``add_comm
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := []
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"

  #eval show Lean.CoreM Unit from do
    let thmName := ``add_comm
    let forbiddenName := ``Nat.add_comm
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
  theorem add_comm (m n : Nat) : m + n = n + m := by
    sorry
---


Prove that for all natural numbers `m` and `n`, we have `m + n = n + m`.

**Note:** You cannot use automated tactics like `apply?`, `grind`, or `simp`. Additionally, using the exact same alternative of this theorem from libraries is not allowed.

<br>
<details>

<summary>References</summary>

[`Nat.add_comm`](https://leanprover-community.github.io/mathlib4_docs/Init/Data/Nat/Basic.html#Nat.add_comm)

</details>

<details>
<summary>Related Problems</summary>

[Natural Number: m+(n+1)=(m+n)+1](/problems/nat-add-succ)  
[Natural Number: (m+1)+n=(m+n)+1](/problems/nat-succ-add)  
[Natural Number: 0+n=n](/problems/nat-zero-add)

</details>
