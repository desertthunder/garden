---
title: Specs for AI Agents
tags:
  - ai
  - engineering
  - agents
  - specs
---

An AI agent spec is a structured document that tells a coding agent what to
build, how to work, what to test, and what not to touch.

The spec should be clear enough to prevent guessing, but focused enough that the
agent can use it. Addy Osmani's rule is useful: minimal does not have to mean
short.[^osmani]

## Start With Vision

Start with the user need, the goal, and the success criteria. Let the agent help
expand that into a fuller spec, but keep control of the direction.

The first version should answer:

- Who is this for?
- What problem does it solve?
- What does success look like?
- What constraints are already known?
- What should stay out of scope?

This keeps the agent from optimizing for implementation details before it knows
the purpose.

## Plan Before Coding

Read-only planning modes are useful because they let the agent inspect the
codebase, identify patterns, ask questions, and write a plan before touching
files.[^osmani]

A good planning phase produces:

- relevant files and existing patterns;
- proposed steps;
- risks and unknowns;
- test strategy;
- acceptance criteria;
- questions that need a human answer.

Do not skip review of the plan. If the plan is wrong, the implementation will
usually be wrong faster.

## Structure

Osmani recommends treating the spec more like a PRD or SRS than a loose prompt.
GitHub's analysis of more than 2,500 agent configuration files found six
recurring areas in useful agent instructions: commands, testing, project
structure, code style, git workflow, and boundaries.[^osmani]

A practical spec outline:

```md
# Feature Spec

## Objective

## Users and Use Cases

## Requirements

## Non-Goals

## Tech Stack

## Commands

## Project Structure

## Code Style

## Boundaries

## Test Plan

## Acceptance Criteria
```

Commands should be executable, not vague. `pnpm test`, `pytest -v`, or
`cargo test` is more useful than "run the tests."

## Workflow

A spec is more useful when it drives the work instead of sitting beside it.
Osmani describes a gated flow:

1. Specify the user experience and success criteria.
2. Plan the technical approach.
3. Break the plan into small tasks.
4. Implement each task and verify it before moving on.[^osmani]

That shape keeps review focused. Instead of reviewing one large generated
change, the human can review the spec, the plan, the task breakdown, and then
the implementation.

## Context Size

Large undifferentiated specs can make agents worse. Context windows are finite,
and models do not pay equal attention to every instruction.[^osmani]

Split large specs by phase or component:

- backend API;
- frontend UI;
- data model;
- migration plan;
- security requirements;
- test plan.

Then feed the agent the relevant slice for the current task. A compact table of
contents or section summary can stay in context while full details are retrieved
only when needed.

Recent AGENTS.md research points in the same direction. One 2026 study found
that unnecessary repository context can reduce task success while increasing
cost, even though agents do tend to follow the instructions they are given.[^agents-eval]
Another cataloged common configuration smells: context bloat, skill leakage,
lint leakage, blind references, init fossilization, and conflicting
instructions.[^agents-smells]

## Boundaries

Flat "do not do this" lists are weaker than tiered boundaries.

| Tier      | Meaning                               | Examples                                         |
| --------- | ------------------------------------- | ------------------------------------------------ |
| Always    | The agent can do this without asking. | Run tests, follow formatting, update docs.       |
| Ask first | The agent must pause for approval.    | Add dependencies, change schemas, edit CI.       |
| Never     | The agent must not do this.           | Commit secrets, edit vendor files, delete tests. |

The point is to make the safe path explicit. The agent should know when to
continue, when to ask, and when to stop.[^osmani]

## Verification

Specs work best when they include checks the agent can run.

Good verification material:

- unit, integration, and end-to-end test commands;
- lint and typecheck commands;
- conformance fixtures;
- expected input/output examples;
- screenshot or visual review requirements;
- self-check questions;
- review-agent prompts for subjective criteria.

Tests give the agent a feedback loop: implement, run checks, inspect failures,
fix, and repeat. Conformance suites are especially useful when the same contract
should hold across implementations.[^osmani]

LLM-as-a-judge can help with subjective criteria such as style, accessibility,
or architecture, but it should supplement deterministic checks rather than
replace them.

## Living Document

A spec that is not updated becomes misleading context. Update it when the data
model changes, a requirement is cut, an edge case is discovered, or the team
chooses a new convention.[^osmani]

Version it with the project. The spec is useful to agents because it is also
useful to humans returning to the code later.

## When To Keep It Small

Not every task needs a full PRD. For a small isolated change, a focused prompt
plus the relevant commands may be enough.

Use a heavier spec when the task has:

- multiple files or phases;
- data model changes;
- security, privacy, or migration risk;
- design or copy requirements;
- ambiguous product behavior;
- expensive review if the first pass is wrong.

The skill is matching spec weight to task risk.

## Terms

| Term                  | Meaning                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| AI agent spec         | A structured document that guides a coding agent's work, checks, and boundaries.                         |
| PRD                   | Product Requirements Document; user-centered description of the problem and success criteria.            |
| SRS                   | Software Requirements Specification; detailed technical requirements for implementation.                 |
| Plan Mode             | Read-only planning phase where an agent can inspect and design before editing code.                      |
| Agent Experience      | Designing docs, schemas, commands, and project structure so agents can reliably consume and act on them. |
| Three-tier boundaries | Rules grouped into always do, ask first, and never do.                                                   |
| Conformance tests     | Spec-derived tests that any implementation must pass.                                                    |
| LLM-as-a-judge        | A second model or agent reviewing output against criteria that are hard to test deterministically.       |

## Questions

- What six areas should a strong coding-agent spec cover?
- Which parts of the spec belong in durable project files versus one-off
  prompts?
- Where does too much context start hurting the agent?
- Which constraints should be always, ask first, or never?
- What tests make the spec enforceable?
- How will the team notice when the spec becomes stale?

[^osmani]:
    Addy Osmani, "How to write a good spec for AI agents," 13 Jan. 2026,
    <https://addyosmani.com/blog/good-spec/>. Accessed 6 Jul. 2026.

[^agents-eval]:
    Thibaud Gloaguen, Niels Mündler, Mark Müller, Veselin Raychev,
    and Martin Vechev, "Evaluating AGENTS.md: Are Repository-Level Context Files
    Helpful for Coding Agents?" arXiv, 12 Feb. 2026,
    <https://arxiv.org/abs/2602.11988>. Accessed 6 Jul. 2026.

[^agents-smells]:
    Helio Victor F. dos Santos, Vitor Costa, Joao Eduardo
    Montandon, Luciana Lourdes Silva, and Marco Tulio Valente, "Configuration
    Smells in AGENTS.md Files: Common Mistakes in Configuring Coding Agents,"
    arXiv, 14 Jun. 2026, <https://arxiv.org/abs/2606.15828>. Accessed 6 Jul. 2026.
