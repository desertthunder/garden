---
title: direnv
---

`direnv` is a tool that allows you to automatically load and unload environment
variables based on the current directory. It works by looking for a `.envrc`
file in the current directory and its parent directories, and then executing
the commands in that file to set up the environment.[^docs]

It's mechanism of action is to create a bash sub-shell that inherits the
environment of the parent shell, and then executes the commands in the
`.envrc` file. When you leave the directory, it unloads the environment
variables that were set up.

I use `direnv` on my [NixOS machines](https://github.com/desertthunder/nixos-conf),
specifically for Tauri development.

[^docs]: https://direnv.net/. Accessed 31 May 2026.
