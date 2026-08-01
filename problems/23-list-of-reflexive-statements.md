---
slug: "list-of-reflexive-statements"
title: "List of Reflexive Statements"
difficulty: "medium"
tags: ["logic", "puzzle"]
sort_order: 23
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (correct_assignment_exists : ∀ {n : Nat}, 1 < n →
    ∃! answers : Vector Bool n, ∀ i : Fin n, (answers[i] ↔ (answers.count false = i + 1)))

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``correct_assignment_exists
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := [``propext, ``Classical.choice, ``Quot.sound]
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"
starter_code: |
  import Mathlib

  theorem correct_assignment_exists : 1 < n →
      ∃! answers : Vector Bool n, ∀ i : Fin n, answers[i] ↔ (answers.count false = i + 1) := by
    sorry
---

A list of `n` statements, where statement number `k` says: **"exactly `k+1` of the statements in this list are false"**.

Encode an assignment as `answers : Vector Bool n`, where `answers[i] = true` means statement `i + 1` is true. It is consistent when

```text
Statement 0. Exactly 1 statement on this list is false.
Statement 1. Exactly 2 statements on this list are false.
Statement 2. Exactly 3 statements on this list are false.
...
Statement n-2. Exactly n-1 statements on this list are false.
Statement n-1. Exactly n statements on this list are false.
```

Prove that for every `n > 1` such an assignment/answers **exists and is unique**.

Example (`n = 3`): statement 1 is true, the other two are false.
```text
Statement 0. Exactly 1 statement on this list is false.
Statement 1. Exactly 2 statements on this list are false.
Statement 2. Exactly 3 statements on this list are false.
```

<details>
<summary>Reference</summary>

[The Mind-Twisting Logical List Riddle — Mind Your Decisions](https://mindyourdecisions.com/blog/2016/10/09/the-mind-twisting-logical-list-riddle-sunday-puzzle/)

</details>
