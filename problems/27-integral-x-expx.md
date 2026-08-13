---
slug: "27-integral-x-expx"
title: "Integral: x * e^x"
difficulty: "medium"
tags: ["calculus", "integral"]
sort_order: 27
verifier_code: |
  import Lean
  import Mathlib.MeasureTheory.Integral.IntervalIntegral.Basic

  {{SOLUTION}}
  
  #check (integration_result : ℝ → ℝ → ℝ)
  #check (integral_x_expx : ∀ a b : ℝ, (∫ x in a..b, x * (Real.exp x)) = integration_result a b)

  #eval show Lean.Meta.MetaM Unit from do
    let env ← Lean.getEnv
    let some (Lean.ConstantInfo.defnInfo info) := env.find? ``integration_result
      | throwError "'integration_result' must be a def"
    let allowed : Lean.NameSet := ({} : Lean.NameSet)
      |>.insert ``HAdd.hAdd
      |>.insert ``HSub.hSub
      |>.insert ``HMul.hMul
      |>.insert ``HDiv.hDiv
      |>.insert ``Neg.neg
      |>.insert ``Real.exp
      |>.insert ``Real
      |>.insert ``OfNat.ofNat
      |>.insert ``OfScientific.ofScientific
    for c in info.value.getUsedConstants do
      if !(allowed.contains c) then
        unless ← Lean.Meta.isInstance c do
          -- sometimes Lean automatically generates aux theorems, we need to skip all propositions  
          let isProp ← match env.find? c with
            | some ci => Lean.Meta.isProp ci.type
            | none => pure false
          unless isProp do
            throwError m!"Usage of '{c}' is disallowed. 'integration_result' must only use basic arithmetic (+, -, *, /) and Real.exp"

  #eval show Lean.Meta.MetaM Unit from do
    let thmName := ``integral_x_expx
    let used ← Lean.collectAxioms thmName
    if used.contains ``sorryAx then
      throwError m!"'{thmName}' proof uses sorry"
    let allowedNames := [``propext, ``Classical.choice, ``Quot.sound]
    let disallowed := used.filter (fun ax => !allowedNames.contains ax)
    if !disallowed.isEmpty then
      throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"

starter_code: |
  import Mathlib.MeasureTheory.Integral.IntervalIntegral.Basic

  noncomputable def integration_result (a b : ℝ) : ℝ := sorry

  theorem integral_x_expx (a b : ℝ) : 
      (∫ x in a..b, x * (Real.exp x)) = integration_result a b := by 
    sorry
---

Integrate the following and find a short formula for

$$\int_a^b x e^x \, dx$$

Define that formula as `integration_result` function and prove that it is equal to result of integration.

<br>

<details>
<summary>Note</summary>

You may only use basic arithmetic operations (`+`, `-`, `*`, `/`) and `Real.exp` to define `integration_result`.

</details>

