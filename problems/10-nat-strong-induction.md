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

<br>
<details>

<summary>References</summary>

[`Nat.strongRecOn`](https://leanprover-community.github.io/mathlib4_docs/Init/WFSimpLemmas.html#Nat.strongRecOn)

</details>

<details>
<summary>Related Problems</summary>

[Natural Number: m+(n+1)=(m+n)+1](/problems/nat-add-succ)  
[Natural Number: (m+1)+n=(m+n)+1](/problems/nat-succ-add)

</details>
