---
title: Compound Engineering
tags:
  - ai
  - engineering
  - agents
---

Compound engineering is an AI-assisted development loop where each task improves
the system that will handle the next task.[^compound]

The normal loop is:

```text
Plan -> Work -> Review -> Compound -> Repeat
```

The first three steps ship the current change. The compound step captures what
the system learned: plans, patterns, bug fixes, review findings, tests, prompts,
agent instructions, commands, and reusable tools.[^compound]

## Main Idea

Normal codebases tend to get harder to change as features accumulate. Compound
engineering tries to reverse that by treating every feature and bug fix as raw
material for future automation.

A bug fix should prevent a class of future bugs. A review finding should become
a test, checklist item, style rule, or reviewer instruction. A repeated manual
workflow should become a command or script.

This is the useful part of the idea. AI makes the compounding loop cheaper
because agents can help plan, implement, review, and document the pattern. But
the loop is not about typing faster. It is about making the development system
less dependent on private memory.

## Planning

The article's strongest claim is that planning becomes the main artifact.
Klaassen and Claude phrase it as "Plans are the new code."[^plans]

A useful plan captures:

- what is being built and why;
- relevant files and existing patterns;
- external docs and best practices;
- constraints and tradeoffs;
- edge cases;
- tests and acceptance criteria;
- review focus.

This matters more with agents because execution is cheap. If the plan is vague,
the agent fills gaps with guesses. If the plan is concrete, implementation and
review both get easier.

## Review

Manual line-by-line supervision does not scale well when agents can produce
large changes quickly. The replacement is not blind trust. It is a better review
system:

- tests, linting, type checks, and screenshots;
- specialized review agents;
- explicit priority levels for findings;
- isolated branches or worktrees;
- logs, rollback paths, and PR checks;
- a final human review of the important decisions.

The article recommends capturing review findings as patterns so the next cycle
can catch the same issue earlier.[^compound]

## Parallel Work

When agents make implementation cheaper, the bottleneck moves from typing to
coordination. Independent tasks can run in parallel, but shared files, shared
schemas, and ambiguous ownership still create conflicts.

The practical rule is to parallelize work with clean boundaries: one feature
area, one review pass, one test-writing task, or one research task. Serial work
still makes sense when the next task depends on decisions from the previous one.

## Compounding

The compound step asks:

- What worked?
- What failed?
- What pattern should be reusable?
- Where should that pattern live?
- Would the system catch this next time?

The answer might be an `AGENTS.md` rule, a `CLAUDE.md` update, a test, a local
command, a review prompt, an architecture note, a generator, or a runbook.

The important distinction is findability. Capturing a lesson in a private chat
log does not compound much. Capturing it in the repo, with useful names and
metadata, gives later agents and humans a chance to retrieve it.

## Agent-Native Architecture

An agent-native environment gives agents the same relevant development surfaces
humans use:

- file access;
- test, lint, typecheck, and build commands;
- local app inspection;
- browser and screenshot access;
- logs and error output;
- issue, PR, and review context;
- rollback and isolation tools.

The article describes this as progressive rather than all-or-nothing. Basic
file and test access is the starting point. Browser access, logs, and PR
creation come later as trust and safety nets improve.[^compound]

Production access still needs boundaries. "Agent-native" should not mean every
agent can mutate secrets, infrastructure, or customer data.

## Taste Extraction

Compound engineering depends on moving taste out of people's heads. Naming,
architecture, testing preferences, UI standards, copy tone, and review habits
should become written context or executable checks.

This is especially useful for small teams. If one person is carrying the whole
style guide in memory, agents and teammates will keep rediscovering it through
review comments.

## Vibe Coding

The source uses "vibe coding" for fast, outcome-oriented prototyping where the
developer cares more about the result than the implementation details. That can
be useful for sketches, demos, and throwaway experiments.

It is risky when the code becomes production software. At that point, the work
needs plans, tests, review, and a compound step so the system can explain and
maintain what was built.

## Beyond Code

The same loop can apply outside implementation:

- product research becomes structured planning context;
- design feedback becomes design-system rules;
- copy review becomes voice and terminology guidance;
- analytics work becomes reusable queries and dashboards.

The common shape is the same: do the work, review the output, then encode the
learning somewhere future work can use it.

## Tensions

The article gives a strong operating model, but several parts are heuristics.
The suggested time split, including heavy emphasis on planning and review, is
experience-based rather than measured proof.[^compound]

The risky failure modes are predictable:

- documentation can become stale;
- agents can optimize for written rules while missing intent;
- parallel work can create coordination conflicts;
- too much autonomy can outrun the available safety nets;
- compounding work can become busywork if nobody retrieves it later.

The practical test is simple: does the captured lesson reduce future review
time, prevent a repeated bug, or make onboarding easier? If not, it may not be
worth keeping.

## Terms

| Term                      | Meaning                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| Compound engineering      | A development approach where each task updates the system so future tasks become easier.     |
| Compound step             | The post-review step that captures lessons, documents patterns, and creates reusable tools.  |
| Agent-native architecture | Project and environment design that lets agents inspect, test, debug, and ship work.         |
| Plan-first development    | Writing and reviewing a plan before implementation starts.                                   |
| Taste extraction          | Encoding a team's preferences into docs, prompts, skills, commands, and automated reviewers. |
| Vibe coding               | Fast outcome-oriented prototyping where implementation details are secondary.                |
| Safety nets               | Tests, reviewers, isolation, logs, rollbacks, and PR checks that make autonomous work safer. |

## Questions

- What kinds of team taste should be encoded in project files?
- Which repeated review findings should become tests?
- Which tasks are safe to parallelize?
- How much local or production access should agents receive?
- How can a team measure whether compounding work is actually paying off?
- What is the smallest useful version of this loop for a solo project?
- What replaces manual line-by-line review in this model?

[^compound]:
    Kieran Klaassen and Claude, "Compound Engineering," Every,
    <https://every.to/guides/compound-engineering>. Accessed 6 Jul. 2026.
