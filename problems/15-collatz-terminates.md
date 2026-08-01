---
slug: "collatz-terminates"
title: "Collatz Terminates"
difficulty: "medium"
tags: ["induction", "number-theory", "decidability"]
sort_order: 15
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (CollatzTerminates.one : CollatzTerminates 1)
  #check (CollatzTerminates.even : ∀ n, CollatzTerminates n → CollatzTerminates (2*n))
  #check (CollatzTerminates.odd : ∀ n, CollatzTerminates (3*(2*n+1)+1) → CollatzTerminates (2*n+1))

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
  import Mathlib.Algebra.Ring.Parity

  inductive CollatzTerminates : Nat → Prop where
    | one : CollatzTerminates 1
    | even n : CollatzTerminates n → CollatzTerminates (2*n)
    | odd n : CollatzTerminates (3*(2*n+1)+1) → CollatzTerminates (2*n+1)

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

Your task is to prove termination for three specific numbers: `2`, `3`, and `1412987847`.

The small cases can be proved by directly applying your constructors. For the large number, this tactic will not scale, so consider other approaches.

<br>

<details>
<summary>Note on formalization</summary>

`3*(2*n+1)+1` is always even so in the next step it will be divided by two and `CollatzTerminates (3*(2*n+1)+1)` will become `CollatzTerminates (3*n+2)`.
Defining `CollatzTerminates.odd : ∀ n, CollatzTerminates (3*n+2) → CollatzTerminates (2*n+1)` is more simple, but we just keep the original form to make it clear that we are strictly following the Collatz function. You can prove it as lemma and use in your proof.

</details>

<details>
<summary>References</summary>

[Collatz conjecture — Wikipedia](https://en.wikipedia.org/wiki/Collatz_conjecture)

</details>
