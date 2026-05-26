---
title: Vim Pack
---

Source: <https://echasnovski.com/blog/2026-03-13-a-guide-to-vim-pack.html>

- `vim.pack` is the built-in Neovim 0.12 plugin manager.
  Add plugins with `vim.pack.add({ ... })`; it installs missing Git repos and
  loads them immediately.
- Specs use full Git URLs.
    - Table specs use `src`, optional `name`, `version`, and `data` fields.
    - For semver tags use `vim.version.range(...)`.
- All managed plugins are installed as opt packages in Neovim's core package
  directory and are loaded with `:packadd` by `vim.pack.add()`.
- The lockfile is `nvim-pack-lock.json` in the config directory.
  Track it with the config; do not edit it by hand.
- Updates are done with `:lua vim.pack.update()` (all plugins) or `:lua vim.pack.update({ 'plugin-name' })`.
  - Useful options include `{ force = true }`, `{ offline = true }`, and `{ target = 'lockfile' }`.
- Delete by first removing plugin loading code from the config, then run
  `:lua vim.pack.del({ 'plugin-name' })`. Do not delete managed plugin
  directories manually.
- Hooks are autocommands for `PackChangedPre` and `PackChanged`. Use them for
  builds or post-update work such as `TSUpdate`.
- Installation hooks must be defined before the `vim.pack.add()` that can
  install the plugin. Defining hooks before the first `vim.pack.add()` is the
  robust approach.
- Lazy loading is possible by calling `vim.pack.add()` later (for example in a
  `vim.schedule()` callback or an autocmd), but it is intentionally not front-and-center.
  - The article recommends starting simple, then adding moderate lazy loading
    only where worthwhile.
- `vim.loader.enable()` as the first line of `init.lua` can improve startup for
  non-lazy-loaded configs.
