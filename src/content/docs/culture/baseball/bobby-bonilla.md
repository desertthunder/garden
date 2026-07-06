---
title: Bobby Bonilla Day
featured: 10
tags:
    - baseball
    - finance
---

On July 1st of every year the New York Mets pay Bonilla $1,193,248.20 under a
deferred-compensation agreement. The payments started in 2011 and continue every July 1
through 2035, even though Bonilla last played for the Mets in 1999 and last appeared
in MLB in 2001.[^1]

Bonilla still gets a seven-figure baseball check long after retirement.

The contract itself is straightforward: the Mets converted \$5.9 million owed for the 2000
season into roughly \$29.8 million paid over 25 years.[^2]

## History

In January 2000, the Mets wanted to move on from Bonilla but still owed him $5.9 million.
Instead of paying the money then, they negotiated a deferral with Bonilla and his agent,
Dennis Gilbert. The unpaid amount would earn 8% interest each year. Payments would begin
in 2011 and run for 25 years.[^1]

The Mets accepted the deal because ownership thought it could earn higher returns elsewhere,
including through investments connected to Bernie Madoff. That logic looked worse after
Madoff's Ponzi scheme collapsed.[^3]

## Math

The deal works like a deferred annuity.

The Mets owed:

$$
PV = 5{,}900{,}000
$$

The annual interest rate was:

$$
r = 8\% = 0.08
$$

The balance compounded for 10 years before payments began:

$$
FV = PV(1 + r)^{10}
$$

Substitute the numbers:

$$
FV = 5{,}900{,}000(1.08)^{10}
$$

$$
FV \approx 12{,}737{,}657
$$

By the start of the payout period, the deferred obligation had grown to about $12.74
million. The Mets then paid that balance as a 25-year annuity. The annual payment
formula is:

$$
\text{Payment} = \frac{FV \cdot r}{1 - (1 + r)^{-n}}
$$

where:

$$
n = 25
$$

Substitute the values:

$$
\text{Payment} = \frac{12{,}737{,}657 \cdot 0.08}{1 - (1.08)^{-25}}
$$

$$
\text{Payment} \approx 1{,}193{,}248.20
$$

That gives the famous annual payment.

Across 25 payments:

$$
1{,}193{,}248.20 \times 25 = 29{,}831{,}205
$$

| Item                 |                  Amount |
| -------------------- | ----------------------: |
| Original amount owed |        **$5.9 million** |
| Interest rate        |                  **8%** |
| Payment period       |           **2011-2035** |
| Annual payment       |       **$1,193,248.20** |
| Total paid           | **about $29.8 million** |

### The Deal

It looked ridiculous, but it was not automatically irrational.

Bonilla got a guaranteed 8% return and predictable long-term income. For him, the
deal was excellent.

For the Mets, the deal made sense only if they could earn more than 8% elsewhere or
if the short-term roster flexibility was worth the financing cost. The problem was
the guarantee. An 8% obligation is expensive, and the Madoff-related assumptions behind
ownership's thinking aged badly.[^3]

Inflation also matters. Bonilla's payments are fixed. A $1.19 million payment in 2035
will buy less than the same nominal payment bought in 2011. That makes the deal less
magical than the meme, but a guaranteed 8% return was still a strong outcome for
Bonilla.[^4]

## Conclusion

The story stuck because it's bananas! A player retired for decades still receives a
million-dollar check every July 1 from a major-market team.

On paper, Bobby Bonilla Day is simply compound interest, deferred compensation, and
a guaranteed 8% financing cost made visible once a year.

[^1]: ESPN, ["Why the Mets pay Bobby Bonilla $1.19 million every July 1"](https://www.espn.com/mlb/story/_/id/16650867/why-mets-pay-bobby-bonilla-119-million-today-every-july-1-2035).

[^2]: CBS Sports, ["July 1 is Bobby Bonilla Day: Why the Mets are still on the hook for $1.19 million until he's 72 years old"](https://www.cbssports.com/mlb/news/july-1-is-bobby-bonilla-day-why-the-mets-are-still-on-the-hook-for-1-19-million-until-hes-72-years-old/).

[^3]: _The Washington Post_, ["The player and the life insurance agent behind Bobby Bonilla Day"](https://www.washingtonpost.com/sports/2025/07/01/bobby-bonilla-day-dennis-gilbert/).

[^4]: MarketWatch, ["Why Bobby Bonilla's $30 million retirement deal wasn't as sweet as people think"](https://www.marketwatch.com/story/why-bobby-bonillas-30-million-retirement-deal-wasnt-as-sweet-as-people-think-60cf0697).
