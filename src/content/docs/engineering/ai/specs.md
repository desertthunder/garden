---
title: Specs for AI Agents
tags:
  - ai
  - engineering
  - agents
  - specs
source: https://addyosmani.com/blog/good-spec/
author: Addy Osmani
date: 2026-01-13
captured: 2026-07-03
---

## Summary

Good specs for AI coding agents are clear, structured, scoped, testable, and
continuously updated: enough context to guide the agent, not so much that it
loses focus.

## Key Ideas

- **Start with the vision:** Give the agent a concise goal, user need, and core
   requirements, then use the agent to draft a more detailed spec.
- **Plan before coding:** Read-only planning modes help the agent explore the
   codebase, ask clarifying questions, and produce a plan before it edits files.
- **Use a professional structure:** A useful spec looks more like a PRD/SRS
   than a loose prompt. It should include objective, stack, commands, tests,
   structure, style, workflow, and boundaries.
- **Keep context modular:** Feed the agent the relevant slice of the spec for
   the current task instead of dumping a giant document into every prompt.
- **Build in verification:** Specs should include tests, acceptance criteria,
   self-checks, boundaries, and review steps so the agent can compare its work
   against the requirements.
- **Treat specs as living artifacts:** Update the spec when requirements,
   architecture, data models, or constraints change; commit it with the
   project like code.
- **Human judgment remains required:** The spec improves agent behavior, but
   the developer still owns quality, intent, tradeoffs, and critical review.

### Massive specs can make agents worse, not better

Osmani argues that context window limits and limited model attention make
large undifferentiated specs unreliable. Long contexts should be summarized,
indexed, split into component specs, or retrieved only when relevant.

**Confidence:** high; this matches the article’s core rationale, though exact
failure thresholds depend on model and task.

### The best specs cover six recurring areas

The article cites GitHub analysis of more than 2,500 agent configuration files
and says effective specs usually include commands, testing, project structure,
code style, git workflow, and boundaries.

**Confidence:** medium-high; the checklist is concrete and practical, but the
article does not reproduce the underlying dataset.

### Specs should be executable parts of the workflow

Rather than writing a spec and ignoring it, Osmani recommends a gated flow:
specify, plan, break into tasks, implement, and verify each phase before moving on.

**Confidence:** high as a workflow recommendation; the specific tools are optional.

### Small focused tasks outperform one giant prompt

The article recommends breaking implementation into phases or components,
passing only the relevant spec section, and starting fresh when switching major
features.

**Confidence:** high; the mechanism is clear: less irrelevant context reduces
instruction conflicts and attention dilution.

### Constraints need nuance

A useful spec should distinguish between actions the agent may always take,
actions requiring human approval, and actions it must never take. This is
better than a flat list of prohibitions.

**Confidence:** high as a practical pattern.

### Tests give agents a feedback loop

Tests, conformance suites, linting, and explicit success criteria let agents
iterate: write code, run checks, inspect failures, fix, and repeat.

**Confidence:** high; automated checks are one of the strongest ways to turn a
spec into enforceable behavior.

## Important Terms

| Term                  | Meaning                                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| AI agent spec         | A structured document that tells a coding agent what to build, how to work, what to test, and what not to touch.      |
| PRD                   | Product Requirements Document; user-centered description of what problem is being solved and what success looks like. |
| SRS                   | Software Requirements Specification; more detailed technical requirements for implementation.                         |
| Plan Mode             | A read-only planning phase where the agent can inspect and design but not edit code.                                  |
| Agent Experience (AX) | Designing docs, schemas, commands, and project structure so agents can reliably consume and act on them.              |
| Three-tier boundaries | Rules grouped into always do, ask first, and never do.                                                                |
| Conformance tests     | Spec-derived tests that any implementation must pass, often reusable across implementations.                          |
| LLM-as-a-Judge        | A second model or agent reviewing output against subjective criteria such as style or architecture.                   |

## Questions for Review

- Why should an AI agent spec start with vision before implementation detail?
- What six areas should a strong coding-agent spec cover?
- Why can too much context reduce an agent’s reliability?
- What is the difference between “always,” “ask first,” and “never” constraints?
- How do tests and conformance suites make specs more enforceable?
- When is a lightweight prompt enough, and when is a full spec necessary?
- Why should specs be version-controlled and updated like code?

## Connections

- Related ideas: spec-driven development, PRDs, SRS documents, test-driven
  development, acceptance criteria, executable documentation.
- Related sources: `AGENTS.md`, `CLAUDE.md`, project READMEs, architecture
  docs, test plans, CI configuration.
- Tensions: detail vs. overload; automation vs. human review; fast prototyping
  vs. production engineering.
- Useful applications: onboarding agents to a repo, writing feature plans,
  constraining autonomous edits, turning requirements into testable tasks.

## Open Questions

- How detailed should a spec be for different task sizes?
- Which parts of a spec belong in a durable project file versus a one-off prompt?
- How should teams detect that a spec has become stale?
- What tooling best connects specs to tests, CI, and agent context retrieval?
- How can teams measure whether better specs reduce review time or rework?

## Notable Quotes

> “Minimal does not necessarily mean short.”

---

> “A spec for an AI agent isn’t ‘write once, done.’”

## Takeaways

- Write specs that are clear, scoped, structured, and testable.
- Give agents only the context they need for the current task.
- Keep the spec alive: update it, version it, and use it as the source of truth
  for planning, implementation, and review.
