---
title: The BEAM
featured: 40
---

The BEAM (Berkeley Erlang Abstract Machine) is the virtual machine that runs Elixir and Erlang programs.

In addition to being a bytecode executor, it provides:

- massive concurrency
- fault tolerance
- message passing
- process isolation
- hot code loading
- distributed systems
- long-running services

Erlang processes are lightweight, fast to create and terminate, dynamically sized, and have low scheduling
overhead, according to the Erlang system documentation. Originally developed at Ericsson (a telecom company),
it was built as a runtime for building many small isolated workers that communicate by messages and can be
restarted when they fail.

## Fault Tolerance

Fault tolerance is handled through supervision trees. Supervisors[^sup] are processes that monitor and restart other
processes when they fail. Instead of treating crashes as catastrophic, design systems so that small parts can
fail and recover.

## OTP

OTP stands for Open Telecom Platform, but the name is historical. In modern Elixir/Erlang, OTP means
"The standard framework, libraries, and design patterns for building reliable BEAM applications."

## GenServer

GenServer is a behavior that provides a standardized way to implement stateful processes in Elixir/Erlang.
OTP[^otp] standardizes how they behave. They have:

- has state
- receives & responds to messages
- handles async casts
- supervision
- lifecycle callbacks

[^otp]: Introduction. https://erlang.org/documentation/doc-5.2/doc/system_architecture_intro/sys_arch_intro.html. Accessed 31 May 2026.

[^sup]: Supervision Principles. https://erlang.org/documentation/doc-4.9.1/doc/design_principles/sup_princ.html. Accessed 31 May 2026.
