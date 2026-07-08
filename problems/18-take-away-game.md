---
slug: "take-away-game"
title: "Take-Away Game"
difficulty: "medium"
tags: ["game-theory", "induction"]
sort_order: 18
verifier_code: |
  import Lean

  {{SOLUTION}}

  #check (game_0 : ∀ (f s : Nat → Finset.Icc 1 3),
    ValidGameFlow #v[f, s] (initial_stones := 0) (turn := 0) (winner := 1))

  #check (game_1 : ∀ (f s : Nat → Finset.Icc 1 3),
    ValidGameFlow #v[f, s] (initial_stones := 0) (turn := 1) (winner := 0))

  #check (game_2 : ∀ (s : Nat → Finset.Icc 1 3),
    ValidGameFlow #v[fun n => ⟨1, by decide⟩, s] (initial_stones := 1) (turn := 0) (winner := 0))

  #check (game_3 : ValidGameFlow #v[fun n => ⟨1 + n % 2, by grind⟩, fun n => ⟨1, by decide⟩]
    (initial_stones := 2) (turn := 0) (winner := 1))

  #check (first_wins_if : Nat → Bool)

  #check (first_wins_iff : ∀ n, (∃ best_strategy, ∀ second,
    ValidGameFlow #v[best_strategy, second] n 0 0) ↔ first_wins_if n)

  #check (second_wins_iff : ∀ n, (∃ best_strategy, ∀ first,
    ValidGameFlow #v[first, best_strategy] n 0 1) ↔ ¬ first_wins_if n)

  #guard first_wins_if 0 = false
  #guard first_wins_if 1 = true
  #guard first_wins_if 2 = true
  #guard first_wins_if 3 = true
  #guard first_wins_if 4 = false
  #guard first_wins_if 21 = true
  #guard first_wins_if 220 = false

  #eval show Lean.Meta.MetaM Unit from do
    for declName in [``game_0, ``game_1, ``game_2, ``game_3, ``first_wins_if, ``first_wins_iff, ``second_wins_iff] do
      let used ← Lean.collectAxioms declName
      if used.contains ``sorryAx then
        throwError m!"'{declName}' proof uses sorry"
      let allowedNames := [``propext, ``Classical.choice, ``Quot.sound]
      let disallowed := used.filter (fun ax => !allowedNames.contains ax)
      if !disallowed.isEmpty then
        throwError m!"'{declName}' uses disallowed axioms: {disallowed.toList}"

  
starter_code: |
  import Mathlib

  -- This proposition holds iff the players move according to their
  -- `players_strategies` functions, and the player with id `winner` wins
  -- at the end of the game.
  inductive ValidGameFlow : (players_strategies : Vector (Nat → Finset.Icc 1 3) 2) →
                            (initial_stones : Nat) →
                            (turn winner : Fin 2) → Prop where
    -- TODO: implement the constructors describing valid game moves

  -- With `0` stones and player `0` to move, player `0` has no valid move and
  -- player `1` wins — regardless of what either player's strategy is.
  theorem game_0 (f s : Nat → Finset.Icc 1 3) :
      ValidGameFlow #v[f, s] (initial_stones := 0) (turn := 0) (winner := 1) := by
    sorry

  -- The symmetric statement of `game_0`, with the roles of the players swapped.
  theorem game_1 (f s : Nat → Finset.Icc 1 3) :
      ValidGameFlow #v[f, s] (initial_stones := 0) (turn := 1) (winner := 0) := by
    sorry

  -- With `1` stone and player `0` to move, if player `0`'s strategy always takes
  -- exactly `1` stone, player `0` wins immediately — regardless of player `1`'s
  -- strategy (since the game ends before player `1` ever moves).
  theorem game_2 (s : Nat → Finset.Icc 1 3) :
      ValidGameFlow #v[fun n => ⟨1, by decide⟩, s] (initial_stones := 1) (turn := 0) (winner := 0) := by
    sorry

  -- With `2` stones, if player `0` takes `1` stone when there's an odd number
  -- left and player `1` always takes `1` stone, then player `1` ends up winning.
  theorem game_3 :
      ValidGameFlow #v[fun n => ⟨1 + n % 2, by grind⟩, fun n => ⟨1, by decide⟩]
        (initial_stones := 2) (turn := 0) (winner := 1) := by
    sorry

  def first_wins_if (n : Nat) : Bool := sorry

  theorem first_wins_iff (n : Nat) :
      (∃ best_strategy, ∀ second, ValidGameFlow #v[best_strategy, second] n 0 0) ↔ first_wins_if n := by
    sorry

  theorem second_wins_iff (n : Nat) :
      (∃ best_strategy, ∀ first, ValidGameFlow #v[first, best_strategy] n 0 1) ↔ ¬ first_wins_if n := by
    sorry
---


 There is a pile of `n` stones. Two players (player `0` and player `1`) alternate turns, starting with player `0`. On each turn, the current player takes between $1$ and $3$ stones from the pile (this is why each player's strategy has type `Nat → Finset.Icc 1 3`: given the current number of remaining stones, it picks how many stones — between $1$ and $3$ — to take). The player who takes the **last stone** wins.

Your tasks:

1. **Define** the inductive predicate `ValidGameFlow players_strategies initial_stones turn winner`
   which should hold exactly when playing the game starting from `initial_stones` stones, with player `turn` moving first, and with both players following `players_strategies` (a `Vector` of the two players' strategy functions), results in `winner` winning the game.

2. **Prove** the base/sanity-check facts `game_0`–`game_3` about small game states.

3. **Define** `first_wins_if : Nat → Bool`, a function which takes the initial stone count and tells whether the *first* player has a guaranteed winning strategy.

4. **Prove** `first_wins_iff` and `second_wins_iff`: characterizations of exactly when the first (respectively second) player has a winning strategy, in terms of `first_wins_if`.


<details>
<summary>Note on the formalization</summary>

Player strategies here are modeled simply as `Nat → Finset.Icc 1 3`, i.e. a function from the *current pile size* to a move. In principle, a player's decision could also depend on the full history of past moves (both their own and their opponent's). This formalization intentionally elides that generality, relying on the (unstated) fact that the history of past moves never needs to affect the optimal next move in this particular game — so a strategy that only looks at the current pile size loses no generality. A fully general formalization of arbitrary game rules would have `players_strategies` also take the move history as an argument.


</details>


<details>
<summary>References</summary>

[Subtraction game — Wikipedia](https://en.wikipedia.org/wiki/Subtraction_game)

[Nim — Wikipedia](https://en.wikipedia.org/wiki/Nim)

</details>
