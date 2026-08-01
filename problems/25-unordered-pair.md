---
slug: "unordered-pair"
title: "Unordered Pair"
difficulty: "medium"
tags: ["type-theory", "functions"]
sort_order: 25
verifier_code: |
  import Lean
  import Mathlib.Algebra.Group.Nat.Defs

  {{SOLUTION}}

  #check (UnorderedPair : Type → Type)
  #check (fun {α : Type} => (UnorderedPair.mk : α → α → UnorderedPair α))
  #check (fun {α : Type} [AddCommMagma α] =>
    (UnorderedPair.sum : UnorderedPair α → α))
  #check (UnorderedPair.sum_correct : ∀ {α : Type} [AddCommMagma α] (u v : α),
    UnorderedPair.sum (UnorderedPair.mk u v) = u + v)
  #check (UnorderedPair.fst_does_not_exist : ∀ {α : Type} [Nontrivial α],
    ¬ ∃ (f : UnorderedPair α → α), ∀ (u v : α), f (UnorderedPair.mk u v) = u)

  -- to make sure that function is computable
  #guard UnorderedPair.sum (UnorderedPair.mk 1 2) = 3

  #eval show Lean.Meta.MetaM Unit from do
    for declName in [``UnorderedPair, ``UnorderedPair.mk, ``UnorderedPair.sum,
        ``UnorderedPair.sum_correct, ``UnorderedPair.fst_does_not_exist] do
      let used ← Lean.collectAxioms declName
      if used.contains ``sorryAx then
        throwError m!"'{declName}' uses sorry"
      let allowedNames := [``propext, ``Classical.choice, ``Quot.sound]
      let disallowed := used.filter (fun ax => !allowedNames.contains ax)
      if !disallowed.isEmpty then
        throwError m!"'{declName}' uses disallowed axioms: {disallowed.toList}"
starter_code: |
  import Mathlib.Algebra.Group.Defs
  import Mathlib.Logic.Nontrivial.Defs

  def UnorderedPair (α : Type) : Type := sorry

  def UnorderedPair.mk {α : Type} (u v : α) : UnorderedPair α := sorry

  def UnorderedPair.sum {α : Type} [AddCommMagma α] (p : UnorderedPair α) : α :=
    sorry

  theorem UnorderedPair.sum_correct {α : Type} [AddCommMagma α] (u v : α) :
      UnorderedPair.sum (UnorderedPair.mk u v) = u + v := by
    sorry

  theorem UnorderedPair.fst_does_not_exist {α : Type} [Nontrivial α] : 
      ¬ ∃ (f : UnorderedPair α → α), ∀ (u v : α), f (mk u v) = u := by
    sorry
---

Implement `UnorderedPair α`, a type containing two values of type `α`, so that the order of the two elements is irrelevant. In particular, `UnorderedPair.mk u v` and `UnorderedPair.mk v u` must be equal. Except that we should be able to perform any computation on the pair, as long as the computation does not depend on the order of the elements — such as the sum, product, or average of the two elements.

Your tasks:

1. **Define** `UnorderedPair.mk` - creates unordered pair from two elements.
2. **Define** `UnorderedPair.sum` - must compute the sum of the two elements stored in an unordered pair.
3. **Prove** `UnorderedPair.sum_correct`, showing that the sum of the pair created from `u` and `v` is `u + v`.
4. **Prove** `UnorderedPair.fst_does_not_exist`: there is no function so that, we can always recover first value of pair.
