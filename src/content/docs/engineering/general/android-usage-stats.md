---
title: Android Usage Stats
tags:
  - android
  - mobile
  - debugging
---

Some devices expose app launch counts and run time through the hidden testing menu.[^1]

## Path

1. Open the dialer.
2. Enter `*#*#4636#*#*`.
3. Open **Usage stats** (name may vary by device).

That screen can show:

- how often an app was started
- how long it ran
- sorting by usage time, usage count, or app name

## Caveats

- OEM and Android-version dependent so some devices do not expose this screen.
- If there is no dialer, a launcher with activity shortcuts may still reveal
  the underlying testing activity.

[^1]: Izzy. “How can I get the history list of times I started using an application?” Android Enthusiasts Stack Exchange, answer 55145. <https://android.stackexchange.com/a/55145>. Accessed 1 Jul 2026.
