---
title: Compound Engineering
tags:
  - ai
  - engineering
  - agents
source: https://every.to/guides/compound-engineering
author: Kieran Klaassen and Claude
date: not listed on the captured page
captured: 2026-07-03
---

## Summary

Compound engineering is an AI-native development philosophy where every unit
of work should make future work easier by turning decisions, fixes, patterns,
and taste into reusable system context.

## Key Ideas

- **The loop is plan → work → review → compound:** Planning defines the work, agents execute it, review catches problems, and the compound step teaches the system so the next task is easier.
- **The compound step is the differentiator:** Without documenting patterns, updating agent instructions, and creating reusable tools, AI-assisted development remains ordinary development with faster typing.
- **Plans become the main artifact:** A good plan captures requirements, tradeoffs, files, edge cases, and acceptance criteria before code exists, making agent execution and later review cheaper.
- **Taste should move out of people’s heads:** Preferences about naming, architecture, testing, copy, and design should be encoded in `CLAUDE.md`, `AGENTS.md`, skills, commands, review agents, and docs.
- **Trust comes from safety nets, not constant supervision:** Tests, review agents, logs, worktrees, PRs, and rollback paths are more scalable than approving every line manually.
- **Agent-native environments reduce manual glue work:** If agents cannot run tests, inspect logs, create PRs, view screenshots, or access debugging data, humans inherit those tasks.
- **Parallel work changes the bottleneck:** Human attention used to be the bottleneck; in this model, compute and coordination become the bottlenecks.

### Each task should make later tasks easier

The article argues that normal codebases get harder to change because each
feature adds complexity. Compound engineering reverses this by using bug fixes,
plans, reviews, and patterns as material for future automation and documentation.

**Confidence:** high for the philosophy; the source offers a clear mechanism
but not quantitative proof.

### AI-assisted work needs more planning and review, not less

The authors recommend spending most feature time on planning and review, with
implementation and compounding taking the smaller share.

Their rationale is that agent execution is only as good as the plan and feedback
loop that guide it.

**Confidence:** medium; plausible, but the specific time split is experiential
rather than empirically established.

### System improvement should be treated as feature work

The article proposes a broader 50/50 allocation: half of engineering time
building features, half improving the system that builds features. Examples
include creating review agents, documenting patterns, and building generators.

**Confidence:** medium; the article gives concrete examples, but the exact
ratio is a heuristic.

### Manual line-by-line review does not scale

The source claims that if engineers cannot trust AI output, they should improve
the system instead of compensating with constant manual review. Review agents,
tests, monitoring, and explicit PR review are the proposed replacements.

**Confidence:** medium; this depends heavily on codebase risk, team maturity,
and quality of verification.

### Agent-native architecture makes AI more useful

The source defines agent-native architecture as giving agents the same relevant
capabilities humans have: running local apps, tests, linters, migrations, git
operations, logs, screenshots, network inspection, and error tracking.

**Confidence:** high as a practical checklist; security and production
permissions still need boundaries.

### Compound engineering extends beyond coding

The article applies the same loop to design, user research, data analysis,
copywriting, and product marketing: structure context, generate artifacts,
review them, and encode what worked for reuse.

**Confidence:** medium; useful pattern, but some sections are sketches rather
than complete processes.

## Important Terms

| Term                      | Meaning                                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Compound engineering      | A development approach where each task updates the system so future tasks become easier.                             |
| Compound step             | The post-review step that captures lessons, documents patterns, updates agent context, and creates reusable tools.   |
| Agent-native architecture | Project and environment design that lets agents inspect, modify, test, debug, and ship work with minimal human glue. |
| Plan-first development    | Writing and reviewing the plan before implementation so the agent has a source of truth.                             |
| Taste extraction          | Encoding a team’s preferences into docs, prompts, skills, commands, and automated reviewers.                         |
| Vibe coding               | Fast outcome-oriented prototyping where the user cares about the result more than the implementation details.        |
| Safety nets               | Tests, reviewers, isolation, logs, rollbacks, and PR checks that make autonomous agent work safer.                   |

## Questions for Review

- What makes compound engineering different from ordinary AI-assisted coding?
- Why is the compound step more important than the implementation step?
- What kinds of team “taste” can be extracted into system context?
- Why do plans become more important when agents write more of the code?
- What capabilities would an agent need to work in an agent-native environment?
- When might vibe coding be useful, and when would it be risky?
- What replaces manual line-by-line review in the compound engineering model?

## Connections

- Related ideas: continuous improvement, knowledge management, test
  automation, platform engineering, agentic workflows.
- Related sources: `AGENTS.md`, `CLAUDE.md`, architecture decision records,
  style guides, runbooks, postmortems.
- Tensions: autonomy vs. control; velocity vs. safety; reusable system context
  vs. documentation overhead.
- Useful applications: recurring bug prevention, onboarding, review automation,
  design system capture, release notes, changelog generation.

## Open Questions

- How should teams measure whether compounding work is actually making
  future work faster?
- Which tasks are safe to parallelize, and which must remain serial to avoid
  coordination failures?
- How much production access should agents receive, even read-only?
- What is the minimum useful version of this workflow for a small project?
- How do teams keep agent instructions and skills from becoming stale or
  contradictory?

## Notable Quotes

> “Each unit of engineering work should make subsequent units easier—not harder.”

---

> “Plans are the new code.”

## Takeaways

- Treat every bug fix, review finding, and design decision as reusable system
  knowledge.
- Build trust by improving plans, tests, reviewers, and rollback paths rather
  than watching every generated line.
- The long-term payoff comes from teaching the system instead of just shipping
  the current feature.
