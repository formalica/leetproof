---
slug: "the-guards-of-heaven-and-hell"
title: "The Guards of Heaven and Hell"
difficulty: "medium"
tags: ["logic", "puzzle"]
sort_order: 3
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (question : Guard → (Response ≃ Bool) → (Guard ≃ Door) → Bool)
  #check (deduce : Response → Door)
  -- TODO check that user did not changed implementation of 'response' function 
  #check (question_exists : ∀ (g : Guard) (response_map : Response ≃ Bool) (door_map : Guard ≃ Door),
    deduce (response g (question g response_map door_map) response_map) = door_map g)

  #guard deduce Response.Blah ≠ deduce Response.Mlah

  #eval show Lean.Meta.MetaM Unit from do
    for declName in [``question, ``deduce, ``question_exists] do
      let used ← Lean.collectAxioms declName
      if used.contains ``sorryAx then
        throwError m!"'{declName}' uses sorry"
      let allowedNames := [``propext, ``Classical.choice, ``Quot.sound]
      let disallowed := used.filter (fun ax => !allowedNames.contains ax)
      if !disallowed.isEmpty then
        throwError m!"'{declName}' uses disallowed axioms: {disallowed.toList}"
starter_code: |
  import Mathlib.Logic.Equiv.Defs

  inductive Response where
    | Blah
    | Mlah
    deriving DecidableEq

  inductive Door where
    | Heaven
    | Hell
    deriving DecidableEq

  inductive Guard
    | Liar
    | Honest
    deriving DecidableEq

  def response (g : Guard) (truth : Bool) (response_map : Response ≃ Bool) : Response :=
    match g with
    | .Liar => response_map.invFun (!truth)
    | .Honest => response_map.invFun truth

  def question (guard_whom_you_ask : Guard) (response_map : Response ≃ Bool) (door_map : Guard ≃ Door) : Bool := sorry

  def deduce (response : Response) : Door := sorry

  theorem question_exists : ∀ (g : Guard) (response_map : Response ≃ Bool) (door_map : Guard ≃ Door),
      deduce (response g (question g response_map door_map) response_map) = door_map g := by
    sorry
---

Two guards keep two doors: one guards the door to `Heaven`, the other the door to `Hell` (this one-to-one mapping is given as `door_map`). One guard always lies, the other always tells the truth. They answer only `Blah` or `Mlah` — one of these words means *yes* and the other means *no*, but you don't know which (this one-to-one mapping is given as `response_map`).

You may ask **one** yes/no question to **one** guard.

Your tasks:

1. **Define** `question` — the truth value of the question you ask, **from the perspective of an honest person** (the liar's inversion is applied afterwards by `response`). It takes all the information the *guard* knows (it may depend on the guard you ask, on their language and doors).
2. **Define** `deduce` — deduce which door is kept by guard who responded to your question. It takes all the information you know: not the guard's type, not `response_map`, not `door_map`.
3. **Prove** `question_exists`: your question always works — for every guard, every meaning of `Blah`/`Mlah`, and every arrangement of the doors.

<details>
<summary>Note on the formalization</summary>

Passing the guard's knowledge to `question` does **not** mean *you* know it — it only says your sentence may talk about the situation ("are you honest?", "would you say `Blah` if I asked …?"), and the guard evaluates it. Your ignorance is modelled by `deduce`, which must work for all eight combinations at once.

</details>



<details>
<summary>Reference</summary>

[Knights and Knaves — Wikipedia](https://en.wikipedia.org/wiki/Knights_and_Knaves)

</details>
