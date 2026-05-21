---
slug: "map-injective-iff"
title: "Map Preserves Injectivity"
difficulty: "medium"
tags: ["lists", "induction", "functions"]
sort_order: 13
main_theorem_name: "map_injective_iff"
theorem_type: "{α β: Sort _} → (f : α → β) → (Function.Injective f ↔ Function.Injective (List.map f))"
allowed_axioms: ['propext','Classical.choice','Quot.sound']
starter_code: |
  theorem map_injective_iff (f : α → β) :
      Function.Injective f ↔ Function.Injective (List.map f) := by
    sorry
---



Prove that a function is injective if and only if mapping it over lists is injective:

$$\hspace{2em} \text{Injective}(f) \iff \text{Injective}(\text{map}\ f)$$

### Background

A function `f` is **injective** (one-to-one) if `f a = f b → a = b` for all `a, b`.

`List.map f` applies `f` to every element of a list:
- `List.map f [] = []`
- `List.map f (x :: xs) = f x :: List.map f xs`

This theorem establishes that injectivity of `f` is equivalent to injectivity of `List.map f`. You'll likely want to prove each direction separately as helper lemmas.
