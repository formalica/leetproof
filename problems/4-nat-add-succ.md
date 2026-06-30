---
slug: "nat-add-succ"
title: "Natural Number: m + (n + 1) = (m + n) + 1"
difficulty: "easy"
tags: ["natural-numbers", "arithmetic"]
sort_order: 4
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (add_succ : (m n : Nat) → m + n.succ = (m + n).succ)

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``add_succ
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := []
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"
starter_code: |
  theorem add_succ (m n : Nat) : m + n.succ = (m + n).succ := by
    sorry
---


Prove that for all natural numbers `m` and `n`, we have `m + n.succ = (m + n).succ`.

<br>

<details>

<summary>References</summary>

[`Nat.add_succ`](https://leanprover-community.github.io/mathlib4_docs/Init/Data/Nat/Basic.html#Nat.add_succ)

</details>

<details>
<summary>Related Problems</summary>

[Natural Number: (m+1)+n=(m+n)+1](/problems/nat-succ-add)  
[Natural Number: 0+n=n](/problems/nat-zero-add)  
[Addition is Commutative](/problems/nat-add-comm)

</details>
