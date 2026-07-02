---
slug: "nat-strong-induction"
title: "Strong Induction Principle"
difficulty: "medium"
tags: ["natural-numbers", "induction"]
sort_order: 10
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (strong_induction : (P : Nat → Prop) → (∀ n, (∀ m, m < n → P m) → P n) → ∀ n, P n)

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``strong_induction
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := [``propext, ``Classical.choice, ``Quot.sound]
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"

  #eval show Lean.CoreM Unit from do
    let thmName := ``strong_induction
    let forbiddenName := ``Nat.strongRecOn
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
  theorem strong_induction
    (P : Nat → Prop)
    (h : ∀ n, (∀ m, m < n → P m) → P n)
    : ∀ n, P n := by
    sorry
---



Prove the **strong induction** (also called **complete induction**) principle for natural numbers:

If for every `n`, `P n` holds whenever `P m` holds for all `m < n`, then `P n` holds for all `n`.

$$\left(\forall n,\; (\forall m < n,\; P(m)) \Rightarrow P(n)\right) \Rightarrow \forall n,\; P(n)$$

**Note:** Using the exact same alternative of this theorem from libraries is not allowed.

<br>
<details>

<summary>References</summary>

[`Nat.strongRecOn`](https://leanprover-community.github.io/mathlib4_docs/Init/WF.html#Nat.strongRecOn)

</details>

<details>
<summary>Related Problems</summary>

[Natural Number: m+(n+1)=(m+n)+1](/problems/nat-add-succ)  
[Natural Number: (m+1)+n=(m+n)+1](/problems/nat-succ-add)

</details>
