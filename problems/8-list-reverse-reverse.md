---
slug: "list-reverse-reverse"
title: "List Reverse Reverse"
difficulty: "medium"
tags: ["list", "induction", "program-verification"]
sort_order: 8
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (List.rev : {α : Type} → List α → List α)
  #check (rev_rev : (α : Type) → (xs : List α) → xs.rev.rev = xs)

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``rev_rev
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := [``propext, ``Classical.choice, ``Quot.sound]
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"
starter_code: |
  def List.rev : List α → List α := sorry

  theorem rev_rev (α : Type) (xs : List α) : xs.rev.rev = xs := by
    sorry
---



Implement the `List.rev` function to reverse a list, then prove that reversing a list twice returns the original:

 $$\hspace{2em} \text{rev}(\text{rev}(xs)) = xs$$

<br>
<details>
<summary>References</summary>

[`List.reverse`](https://leanprover-community.github.io/mathlib4_docs/Init/Data/List/Basic.html#List.reverse)
[`List.reverse_reverse`](https://leanprover-community.github.io/mathlib4_docs/Init/Data/List/Lemmas.html#List.reverse_reverse)

</details>

