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
starter_code: |
  theorem add_comm (m n : Nat) : m + n = n + m := by
    sorry
---


Prove that for all natural numbers `m` and `n`, we have `m + n = n + m`.

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
