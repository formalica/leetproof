---
slug: "nat-zero-add"
title: "Natural Number: 0 + n = n"
difficulty: "easy"
tags: ["natural-numbers", "induction", "arithmetic"]
sort_order: 6
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (zero_add : (n : Nat) → 0 + n = n)

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``zero_add
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := []
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"
starter_code: |
  theorem zero_add (n : Nat) : 0 + n = n := by
    sorry
---
 


Prove that for any natural number `n`, we have `0 + n = n`.

<br>
<details>

<summary>References</summary>

[`Nat.zero_add`](https://leanprover-community.github.io/mathlib4_docs/Init/Data/Nat/Basic.html#Nat.zero_add)

</details>

<details>
<summary>Related Problems</summary>

[Natural Number: m+(n+1)=(m+n)+1](/problems/nat-add-succ)  
[Natural Number: (m+1)+n=(m+n)+1](/problems/nat-succ-add)  
[Addition is Commutative](/problems/nat-add-comm)

</details>
