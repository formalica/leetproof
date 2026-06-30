---
slug: "collatz-terminates"
title: "Collatz Terminates"
difficulty: "medium"
tags: ["induction", "number-theory", "decidability"]
sort_order: 15
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (collatz_2 : CollatzTerminates 2)
  #check (collatz_3 : CollatzTerminates 3)
  #check (collatz_1412987847 : CollatzTerminates 1412987847)

  #eval show Lean.Meta.MetaM Unit from do
    for thmName in [``collatz_2, ``collatz_3, ``collatz_1412987847] do
      let used ← Lean.collectAxioms thmName
      if used.contains ``sorryAx then
        throwError m!"'{thmName}' proof uses sorry"
      let allowedNames := [``propext, ``Classical.choice, ``Quot.sound, ``Lean.ofReduceBool, ``Lean.trustCompiler]
      let disallowed := used.filter (fun ax => !allowedNames.contains ax)
      if !disallowed.isEmpty then
        throwError m!"'{thmName}' uses disallowed axioms: {disallowed.toList}"
starter_code: |
  inductive CollatzTerminates : Nat → Prop where
   -- TODO implement

  theorem collatz_2 : CollatzTerminates 2 := by
    sorry

  theorem collatz_3 : CollatzTerminates 3 := by
    sorry

  theorem collatz_1412987847 : CollatzTerminates 1412987847 := by
    sorry
---

The **Collatz sequence** starting from $n$ is defined by repeatedly applying the function:

$$f(n) = \begin{cases} n / 2 & \text{if } n \text{ is even} \\ 3n + 1 & \text{if } n \text{ is odd} \end{cases}$$

until we reach $1$. The **Collatz conjecture** (also known as the $3n+1$ problem) states that this sequence always eventually reaches $1$ — but it remains unproven for all natural numbers!

Your tasks:

1. **Define** the inductive predicate `CollatzTerminates : Nat → Prop` that captures when a starting number eventually reaches $1$ under Collatz iteration.

2. **Prove** termination for three specific numbers:
   - `collatz_2 : CollatzTerminates 2`
   - `collatz_3 : CollatzTerminates 3`
   - `collatz_1412987847 : CollatzTerminates 1412987847`

The small cases can be proved by directly applying your constructors. For the large number, this tactic will not scale, so consider other approaches.

<br>
<details>
<summary>References</summary>

[Collatz conjecture — Wikipedia](https://en.wikipedia.org/wiki/Collatz_conjecture)

</details>
