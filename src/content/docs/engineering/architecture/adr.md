---
title: Architecture Decision Records
---

## Overview

- An Architecture Decision Record (abbr. ADR) is any document that captures
decisions and context of how an architecture decision was made and its resulting
context.
    - In modern codebases, tests and readable code can replace documentation.[^4]
- Large documents are not read often and smaller, atomic writing is easiest for
consumption.
- In any system, we want to avoid blind acceptance and reversal
- Significant decisions are those that "affect the structure, non-functional
characteristics, dependencies, interfaces, or construction techniques."[^1]

### Benefits

- Onboarding can include an understanding of the why behind a decision
    - Handover can be smooth
- Since stakeholders can read and digest these, you can have multi-discipline
best practice alignment[^2]
- Keep why and how out of the original maintainer's brain

### When to Write

- Backfilling decisions
- Large change proposals (these can be rejected too!)
  - Small/lightweight changes too

## Sections

### Context

- Describe *forces at play.*
- Political, social, project specific

### Consequences

- Resulting context (positive, negative, and neutral)
  - *i.e.* Why or why not a decision was made[^5]
- Larger ADRs provide context for smaller, subsequent ADRs

## Tips

- Lightweight markup language
- Less than 2 pages
- Use a sequential naming scheme.
- Don't use these to replace good commit messages.[^3]

## Template

Used by RedHat.[^3]

???+ abstract "RedHat ADR Template"

    1. **Number/Date:** A unique increasing number and date that usually follows
     the *ADR-nnnn* pattern to help sort them from old to new
    2. **Title:** Indicates the content
    3. **Context (Why):** Describes the current situation and *why* you made this
    decision or thought it necessary—some variations explicitly break out an
    "alternatives covered" section to ensure all considerations get recorded
    4. **Decision (What/How):** Describes the *what* and *how* of the feature
    5. **Status:** Describes the status; note that ADRs can be superseded later
    by newer ADRs
    6. **Consequences:** Describes the effect of the decision, listing positive
    and negative aspects

## Further Reading

<https://cloud.google.com/architecture/architecture-decision-records>

<https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html>

<https://github.com/peter-evans/lightweight-architecture-decision-records>

<https://adr.github.io>

<https://github.com/operate-first/blueprint/tree/main/adr>

[^1]: Nygard, Michael. “Documenting Architecture Decisions.” *Cognitect.Com*, 15 Nov. 2011, <https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions>.
[^2]: Engineering, Spotify. “When Should I Write an Architecture Decision Record.” *Spotify Engineering*, 14 Apr. 2020, <https://engineering.atspotify.com/2020/04/when-should-i-write-an-architecture-decision-record/>.
[^3]: hrupp. Why You Should Be Using Architecture Decision Records to Document Your Project. 16 Dec. 2021, <https://www.redhat.com/architecture-decision-records>.
[^4]: “Lightweight Architecture Decision Records | Technology Radar.” *Thoughtworks*, <https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records>. Accessed 31 May 2024.
[^5]: ckittel. Architecture Decision Record - Microsoft Azure Well-Architected Framework. 14 Nov. 2023, <https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record>.
