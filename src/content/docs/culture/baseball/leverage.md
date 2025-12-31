---
title: Leverage Index
---

How important is *this* plate appearance, relative to an average one?

## What is Leverage / Leverage Index?

Leverage Index was created by Tom Tango to measure **how much the win probability could swing** on the next play, given the current game state (inning, score, outs, baserunners). A value of:

- **1.0** = "neutral" situation (average plate appearance)
- **> 1.0** = high leverage (big potential swing in win probability)
- **< 1.0** = low leverage (blowouts, early innings with no one on, etc.)[^1]

When people talk about "leverage" for a pitcher (especially relievers), they usually mean:

- **Average Leverage Index (aLI)** - the average LI of all plate appearances they faced.
- **gmLI / inLI** - game-entering or entry leverage when they first appear[^2]

## How is Leverage Index calculated?

High-level formula:

1. Take current **Win Expectancy (WE₀)** for the batting team given:
   - inning
   - score differential
   - outs
   - base state
2. Enumerate the **possible outcomes** of the plate appearance:
   - out, walk, single, double, HR, etc.
3. For each outcome *i*:
   - Compute **WEᵢ** = win expectancy after that outcome
   - Let **ΔWEᵢ = |WEᵢ − WE₀|** (absolute change in win probability)
   - Weight it by the probability **pᵢ** of that outcome
4. Compute the **expected absolute swing in WE** for this PA:

    $\text{Swing}_\text{this PA} = \sum_i p_i \cdot |\text{WE}_i - \text{WE}_0|$
5. Compute the **average swing** over *all* plate appearances in your dataset:

    $\text{Swing}_\text{avg} = \text{mean over all PA of } \sum_i p_i \cdot |\text{WE}_i - \text{WE}_0|$

6. The **Leverage Index (LI)** of this state is:

    $LI = \frac{\text{Swing}*\text{this PA}}{\text{Swing}*\text{avg}}$

This is exactly how FanGraphs and others describe it: expected WE swing for this state, divided by the league-wide average swing[^2]

[^1]: <https://www.mlb.com/glossary/advanced-stats/leverage-index> "Leverage Index (LI)"
[^2]: <https://library.fangraphs.com/misc/li/> "LI - Sabermetrics Library - FanGraphs"
