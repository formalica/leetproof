---
slug: "fib-generating-function"
title: "Fibonacci Generating Function"
difficulty: "medium"
tags: ["number-theory", "power-series"]
sort_order: 17
verifier_code: |
  import Mathlib

  {{SOLUTION}}

  #check (fib_generating_function : {R : Type _} -> [Field R] ->
      PowerSeries.mk (fun n => (Nat.fib n : R)) =
      PowerSeries.X * (1 - PowerSeries.X - PowerSeries.X ^ 2 : PowerSeries R)⁻¹)

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``fib_generating_function
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := [``propext, ``Classical.choice, ``Quot.sound]
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"
starter_code: |
  import Mathlib

  theorem fib_generating_function {R : Type*} [Field R] : 
      PowerSeries.mk (fun n => (Nat.fib n : R)) =
      PowerSeries.X * (1 - PowerSeries.X - PowerSeries.X ^ 2 : PowerSeries R)⁻¹ := by
    sorry
---

The Fibonacci sequence is defined by $F_0 = 0$, $F_1 = 1$, and $F_{n+2} = F_{n+1} + F_n$ for $n \ge 0$.

A classical result in combinatorics is that the **ordinary generating function** of the Fibonacci sequence has a closed form:

$$\sum_{n=0}^{\infty} F_n \, x^n = \frac{x}{1 - x - x^2}$$

Your task is to prove this identity in Lean, using `PowerSeries R` to represent the formal power series $\sum_{n=0}^{\infty} F_n x^n$, encoded as `PowerSeries.mk (fun n => (Nat.fib n : R))`.

<br>
<details>
<summary>References</summary>

[`Mathlib.RingTheory.PowerSeries.Inverse`](https://leanprover-community.github.io/mathlib4_docs/Mathlib/RingTheory/PowerSeries/Inverse.html)

[`Mathlib.RingTheory.PowerSeries.Basic`](https://leanprover-community.github.io/mathlib4_docs/Mathlib/RingTheory/PowerSeries/Basic.html)

[`Mathlib.Data.Nat.Fib.Basic`](https://leanprover-community.github.io/mathlib4_docs/Mathlib/Data/Nat/Fib/Basic.html)

</details>
