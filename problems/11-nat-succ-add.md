---
slug: "nat-succ-add"
title: "Natural Number: (m + 1) + n = (m + n) + 1"
difficulty: "easy"
tags: ["natural-numbers", "induction", "arithmetic"]
sort_order: 11
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (succ_add : (m n : Nat) → m.succ + n = (m + n).succ)

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``succ_add
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := []
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"
starter_code: |
  theorem succ_add (m n : Nat) : m.succ + n = (m + n).succ := by
    sorry
---


Prove that for all natural numbers `m` and `n`, we have `m.succ + n = (m + n).succ`.

<br>
<details>

<summary>References</summary>

[`Nat.succ_add`](https://leanprover-community.github.io/mathlib4_docs/Init/Data/Nat/Basic.html#Nat.succ_add)

</details>

<details>
<summary>Related Problems</summary>

[Natural Number: m+(n+1)=(m+n)+1](/problems/nat-add-succ)  
[Natural Number: 0+n=n](/problems/nat-zero-add)  
[Addition is Commutative](/problems/nat-add-comm)

</details>
