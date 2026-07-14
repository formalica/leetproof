---
slug: "day-of-the-week"
title: "Day of the Week"
difficulty: "medium"
tags: ["number-theory", "arithmetic", "program-verification"]
sort_order: 19
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (fastDayOfWeek_correct : ∀ (d m y : Nat) (dow : Fin 7),
    (fastDayOfWeek d m y = dow ∧ validDate d m y) ↔ IsDayOfWeek d m y dow)

  #check (fastDayOfWeek : Nat → Nat → Nat → Fin 7) 

  #guard fastDayOfWeek 1 1 1 = 0
  #guard fastDayOfWeek 1 1 2000 = 5
  #guard fastDayOfWeek 25 12 2024 = 2
  #guard fastDayOfWeek 29 2 2000 = 1
  -- Year is ~10^12: only an O(1)-ish (or near-linear-in-digits) formula survives
  -- the verification timeout here; a loop over days/months/years will not.
  #guard fastDayOfWeek 1 1 1000000000001 = 0

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``fastDayOfWeek_correct
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := [``propext, ``Classical.choice, ``Quot.sound]
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"
starter_code: |
  import Mathlib

  def isLeapYear (y : Nat) : Bool :=
    if y % 400 == 0 then true
    else if y % 100 == 0 then false
    else y % 4 == 0

  def daysInMonth (m y : Nat) : Nat :=
    match m with
    | 2 => if isLeapYear y then 29 else 28
    | 4 | 6 | 9 | 11 => 30
    | _ => 31

  inductive IsDayOfWeek : Nat → Nat → Nat → Fin 7 → Prop where
    -- TODO implement

  def fastDayOfWeek (d m y : Nat) : Fin 7 := sorry

  def validDate (d m y : Nat) : Prop :=
    1 ≤ d ∧ 1 ≤ m ∧ 1 ≤ y ∧ d ≤ daysInMonth m y ∧ m ≤ 12

  theorem fastDayOfWeek_correct (d m y : Nat) (dow : Fin 7) :
      (fastDayOfWeek d m y = dow ∧ validDate d m y) ↔ IsDayOfWeek d m y dow := by
    sorry
---

Given a valid date as `day`/`month`/`year`, return the day of the week. Jan 1, year 1 is a **Monday**. `year ≥ 1`, and weekdays are numbered `0`–`6` starting from Monday.

Your tasks:

1. **Define** the inductive predicate `IsDayOfWeek d m y dow`, which holds exactly when `dow` is the day of the week of date `d`/`m`/`y`.
2. **Define** `fastDayOfWeek : Nat → Nat → Nat → Fin 7`, a fast implementation (no day-by-day or year-to-year iteration at a time — it must handle years far in the future in O(1) without timing out).
3. **Prove** `fastDayOfWeek_correct`, relating `fastDayOfWeek` to `IsDayOfWeek` for all valid dates.

<details>
<summary>References</summary>

[Determination of the day of the week — Wikipedia](https://en.wikipedia.org/wiki/Determination_of_the_day_of_the_week)

</details>
