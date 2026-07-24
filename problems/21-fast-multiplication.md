---
slug: "fast-multiplication"
title: "Fast Multiplication"
difficulty: "medium"
tags: ["induction", "arithmetic", "program-verification"]
sort_order: 21
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (mulShlow : Nat → Nat → Nat)
  #check (mulFast : Nat → Nat → Nat)
  #check (mulFast_correct : ∀ {x y : Nat}, mulSlow x y = mulFast x y)

  open Lean in
  #eval show Lean.CoreM Unit from do
    let n := ``mulFast
    if ((← getEnv).find? n).isNone then throwError "Unknown: {n}"
    let rec col e a : NameSet :=
      match e with
      | .const n _ => a.insert n
      | .app f x => col x (col f a)
      | .lam _ d b _ | .forallE _ d b _ => col b (col d a)
      | .letE _ t v b _ => col b (col v (col t a))
      | .mdata _ e | .proj _ _ e => col e a
      | _ => a
    let rec check x : StateT NameSet CoreM Unit := do
      if (← get).contains x then return
      modify (·.insert x)
      if [``HMul.hMul, ``Nat.mul, ``Mul.mul, ``mulShlow].contains x then 
        throwError "using {x} is not allowed in {n}"
      if let some i := (← getEnv).find? x then
        if let .thmInfo _ := i then return
        for c in (col (i.value?.getD (.bvar 0)) (col i.type {})).toList do 
          check c
    check n |>.run' {}

  #eval show Lean.Meta.MetaM Unit from do
    for declName in [``mulFast, ``mulFast_correct] do
      let used ← Lean.collectAxioms declName
      if used.contains ``sorryAx then
        throwError m!"'{declName}' uses sorry"
      let allowedNames := [``propext, ``Classical.choice, ``Quot.sound]
      let disallowed := used.filter (fun ax => !allowedNames.contains ax)
      if !disallowed.isEmpty then
        throwError m!"'{declName}' uses disallowed axioms: {disallowed.toList}"

  #guard mulFast 4 6516516216326566954651321 = 26066064865306267818605284
  #guard mulFast 6516516216326566954651321 4 = 26066064865306267818605284
  #guard mulFast 6516516216326566954651321 6516516216326566954651321 = 42464983597647116367296785820512909946516687045041

starter_code: |
  def mulSlow : Nat → Nat → Nat
    | _, 0   => 0
    | x, y+1 => x + (mulSlow x y)

  -- You may NOT use `*` multiplication here
  def mulFast : Nat → Nat → Nat :=
    sorry

  -- These only reduce quickly if your implementation is genuinely sub-linear.
  example: mulFast 4 6516516216326566954651321 = 26066064865306267818605284 := by sorry
  example: mulFast 6516516216326566954651321 4 = 26066064865306267818605284 := by sorry
  example: mulFast 6516516216326566954651321 6516516216326566954651321 = 42464983597647116367296785820512909946516687045041 := by sorry

  theorem mulFast_correct (x y : Nat) : mulSlow x y = mulFast x y := by
    sorry


---

`mulSlow` multiplies by repeated addition and runs in $O(y)$ time. This is impractical for large numbers.

Your tasks:

1. **Implement** `mulFast : Nat → Nat → Nat` multiplies numbers in logarithmic time. You can not use `*`, `Mul.mul` and `Nat.mul`.
2. **Prove** `mulFast_correct` which states that `mulFast` and `mulSlow` produce the same result for all inputs.

<details>
<summary>References</summary>

[Ancient Egyptian multiplication — Wikipedia](https://en.wikipedia.org/wiki/Ancient_Egyptian_multiplication)

</details>
