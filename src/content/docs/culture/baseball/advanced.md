---
title: Advanced Stats
---

## WAR (Wins Above Replacement)

There are **different WARs** (FanGraphs fWAR, Baseball-Reference bWAR, Baseball Prospectus WARP).

### Position players (FanGraphs)

FanGraphs defines WAR as: ([Sabermetrics Library][1])

> **WAR = (Batting Runs + BaseRunning Runs + Fielding Runs + Positional Adjustment + League Adjustment + Replacement Runs) / RunsPerWin**

Where (all in "runs"):

- **Batting Runs** = `wRAA` (weighted runs above average, from wOBA - see below)
- **BaseRunning Runs** = `BsR` (runs above avg from baserunning model)
- **Fielding Runs** = UZR / DRS / OAA-type metric converted to runs
- **Positional Adjustment** = per-inning/per-game constant by position (C, SS, 2B, 3B, CF, LF/RF, 1B, DH) ([The Hardball Times][2])
- **League Adjustment** = small correction if you mix AL/NL, pitchers hitting, etc.
- **Replacement Runs** ≈ `ReplacementRunsPerPA * PA` or `ReplacementRunsPerIP * IP`

### Pitchers (FanGraphs, FIP-based WAR)

Very simplified FIP-WAR idea:

1. Compute **FIP** (see below).
2. Turn FIP into runs above/below replacement:
   $$\text{RunsAboveRepl} = (\text{ReplacementFIP} - \text{PitcherFIP}) \times \frac{\text{IP}}{9}$$
3. Adjust for park & league, then divide by RunsPerWin.

Each site uses its own replacement level, park factors, leverage, etc., which is why fWAR and bWAR differ.

## wOBA (Weighted On-Base Average)

General formula:

$$
\text{wOBA} =
\frac{w_{BB}
\cdot (BB - IBB) + w_{HBP}
\cdot HBP + w_{1B}
\cdot 1B + w_{2B}
\cdot 2B + w_{3B}
\cdot 3B + w_{HR}
\cdot HR} {AB + BB - IBB + SF + HBP}
$$

- The weights are **year-specific linear weights** derived from league run values, published in the FanGraphs Guts table. ([Sabermetrics Library][4])

## wRAA (Weighted Runs Above Average)

$$\text{wRAA} = \frac{\text{wOBA} - \text{lgwOBA}}{\text{wOBAScale}} \times PA$$

- `lgwOBA` and `wOBAScale` are also year-specific constants (league wOBA and the scale factor chosen so league wOBA ≈ league OBP). ([Sabermetrics Library][5])

## wRC (Weighted Runs Created, raw runs)

A common version: $\text{wRC} = \text{wRAA} + \frac{\text{lgR}}{\text{lgPA}} \times PA$

- `lgR` = league runs, `lgPA` = league plate appearances; so `lgR/lgPA` is league runs per PA. ([Sabermetrics Library][6])

## wRC+ (park- & league-adjusted, scaled to 100)

Conceptually:

> **wRC+ = 100 × (player’s park-adjusted runs per PA ÷ league runs per PA)**

A common algebraic representation (FanGraphs) after park & league adjustment is applied is: ([Sabermetrics Library][5])

$$
\text{wRC+} =
\left(
\frac
{\frac{\text{wRAA}}{PA} + \frac{\text{lgR}}{\text{lgPA}}}
{\frac{\text{lgR}}{\text{lgPA}}}
\right) \times 100
$$

Interpretation:

- 100 = league-average hitter
- 120 = **20% better** than league average, etc. ([Sabermetrics Library][7])

## OPS and OPS+

- **OBP** (on-base percentage): $OBP = \frac{H + BB + HBP}{AB + BB + HBP + SF}$
- **SLG** (slugging): $SLG = \frac{TB}{AB}$
- **OPS**: $OPS = OBP + SLG$ ([Baseball Reference][8])

- **OPS+** is a normalized OPS that adjusts for league & park.
    - Baseball-Reference formula (conceptually): ([Baseball Reference][9]):

      $OPS^+ \approx 100 \times \left(\frac{OBP}{lgOBP} + \frac{SLG}{lgSLG} - 1\right) \times \text{park adjustment}$

- 100 = league average, >100 better, <100 worse, like wRC+.

## BABIP (Batting Average on Balls in Play)

$$BABIP = \frac{H - HR}{AB - K - HR + SF}$$

Standard definition (FanGraphs / BBRef) - you remove HRs and strikeouts from both numerator and denominator. ([Baseball Reference][10])

## ISO (Isolated Power)

$ISO = SLG - AVG$

Where `AVG = H/AB`. This is effectively extra bases per at-bat. ([Baseball Reference][10])

## Rate stats: K%, BB%, etc

- **K%** (strikeout rate): $K% = \frac{SO}{PA}$
- **BB%** (walk rate): $BB% = \frac{BB}{PA}$
- **HR/FB**: $HR/FB = \frac{HR}{\text{Fly Balls}}$

You can also use **per-PA** or **per-BF** versions depending on hitter vs pitcher.

## Common **pitching** advanced stats

### FIP (Fielding Independent Pitching)

Measures a pitcher on events he "mostly controls": HR, BB/HBP, K. ([Sabermetrics Library][11])

$$FIP = \frac{13 \cdot HR + 3 \cdot (BB + HBP) - 2 \cdot K}{IP} + C$$

- `C` is the **FIP constant** chosen so **league FIP = league ERA** for that season (FanGraphs publishes these in Guts). ([FanGraphs][3])

#### xFIP (Expected FIP)

Same structure as FIP, but replace HR with **expected HR** using league HR/FB: ([Wikipedia][12])

1. Compute: $xHR = FB \times \text{lgHR/FB}$

2. Plug into FIP formula: $xFIP = \frac{13 \cdot xHR + 3\cdot(BB + HBP) - 2\cdot K}{IP} + C$

### ERA and ERA+

- **ERA**: $ERA = 9 \times \frac{ER}{IP}$

**ERA+** (BBRef / MLB style) normalizes ERA to league average & park:

Conceptually: ([MLB.com][13]) $ERA^+ \approx 100 \times \frac{lgERA}{ERA} \times \text{park adjustment}$

- 100 = league-average pitcher; 150 = **50% better** than league average (lower actual ERA).

### "Per 9" rates

- K/9: $K/9 = 9 \times \frac{K}{IP}$
- BB/9: $BB/9 = 9 \times \frac{BB}{IP}$
- HR/9: $HR/9 = 9 \times \frac{HR}{IP}$

[1]: https://library.fangraphs.com/war/war-position-players/ "WAR for Position Players - Sabermetrics Library - FanGraphs"
[2]: https://tht.fangraphs.com/re-examining-wars-defensive-spectrum/ "Re-Examining WAR's Defensive Spectrum | The Hardball Times"
[3]: https://www.fangraphs.com/tools/guts "Guts! Tool | FanGraphs Baseball"
[4]: https://library.fangraphs.com/offense/woba/ "wOBA | Sabermetrics Library - FanGraphs"
[5]: https://library.fangraphs.com/offense/wrc/ "wRC and wRC+ - Sabermetrics Library - FanGraphs"
[6]: https://library.fangraphs.com/woba-as-a-gateway-statistic/ "wOBA As a Gateway Statistic | Sabermetrics Library - FanGraphs"
[7]: https://library.fangraphs.com/wrc-and-lessons-of-context/ "wRC+ and Lessons of Context - Sabermetrics Library"
[8]: https://www.baseball-reference.com/glossary/on-base-plus-slugging/ "On Base Plus Slugging (OPS)"
[9]: https://www.baseball-reference.com/bullpen/Adjusted_OPS "OPS - BR Bullpen"
[10]: https://www.baseball-reference.com/about/bat_glossary.shtml "Batting Stats Glossary"
[11]: https://library.fangraphs.com/pitching/fip/ "FIP - Sabermetrics Library - FanGraphs"
[12]: https://en.wikipedia.org/wiki/Fielding_independent_pitching "Fielding independent pitching"
[13]: https://www.mlb.com/glossary/advanced-stats/on-base-plus-slugging-plus "On-base Plus Slugging Plus (OPS+) | Glossary"
