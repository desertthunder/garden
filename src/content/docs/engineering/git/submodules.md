---
title: Git Submodules Workflow
---

## Create or Add a Submodule

### Option A — Add an existing remote repo

```sh
cd parent-repo
git submodule add https://github.com/username/child-repo.git path/to/child-repo
git submodule update --init --recursive
```

### Option B — Add a local repo as a submodule (no remote)

```sh
git submodule add ../child-repo path/to/child-repo
git submodule update --init --recursive
```

## Working Inside the Submodule

```sh
cd path/to/child-repo
git status
git add .
git commit -m "Your descriptive message"
```

If a remote exists:

```sh
git push origin main
```

## Update the Parent Repository Pointer

Once you’ve committed inside the submodule:

```sh
cd ../..                # back to parent repo
git status              # shows "modified: path/to/child-repo"
git add path/to/child-repo
git commit -m "Update submodule to latest commit"
git push origin main
```

## Clone or Update Repos with Submodules

When cloning a parent that includes submodules:

```sh
git clone --recurse-submodules https://github.com/username/parent-repo.git
```

If you’ve already cloned without initializing:

```sh
git submodule update --init --recursive
```

To pull new commits from all submodules:

```sh
git submodule update --remote --merge
```

## Maintenance Commands

| Action                                        | Command                                                                                                             |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Re-sync submodule URLs after changing remotes | `git submodule sync`                                                                                                |
| Remove a submodule cleanly                    | `git submodule deinit -f path/to/submodule && rm -rf .git/modules/path/to/submodule && git rm -f path/to/submodule` |
| Check current submodule commits               | `git submodule status`                                                                                              |
| Update all submodules recursively             | `git submodule update --remote --recursive`                                                                         |

## Directory and Config Structure

```sh
parent-repo/
├── .git/
├── .gitmodules
├── path/
│   └── child-repo/
│       ├── .git/  # submodule’s repo files
│       └── ...
```

Example `.gitmodules` file:

```ini
[submodule "path/to/child-repo"]
    path = path/to/child-repo
    url = https://github.com/username/child-repo.git
```

## Summary

```text
┌─────────────┐
│  Developer  │
└──────┬──────┘
       │
       │ Edits & commits
       ├──────────────────────────┐
       │                          │
       │                          │ Commits updated pointer
       ▼                          ▼
┌─────────────────┐        ┌───────────────┐
│ Submodule Repo  │        │  Parent Repo  │
│                 │        │               │
│ • Own commits   │        │ • Contains    │
│ • Own history   │◄───────┤   pointer     │
│                 │        │ • Tracks      │
└────────┬────────┘        │   commit hash │
         │                 │ • .gitmodules │
         │ Push (optional) │   + index     │
         │                 └──────┬────────┘
         ▼                        │
┌──────────────────┐              │ Push
│ Submodule Remote │              │
└──────────────────┘              ▼
                           ┌───────────────┐
                           │ Parent Remote │
                           └───────────────┘
```

1. You commit changes **inside the submodule**.
2. The **submodule HEAD changes** (new commit).
3. The **parent repo detects** this and records the new commit hash.
4. You **commit that change** in the parent.
5. Each repo can be pushed independently.

## Quick Reference

| Task           | Location  | Command                                        |
| -------------- | --------- | ---------------------------------------------- |
| Add submodule  | Parent    | `git submodule add <url> path/to/child`        |
| Commit changes | Submodule | `git add . && git commit -m "msg"`             |
| Push submodule | Submodule | `git push origin main`                         |
| Update pointer | Parent    | `git add path/to/child && git commit -m "msg"` |
| Push parent    | Parent    | `git push origin main`                         |
| Clone all      | —         | `git clone --recurse-submodules <url>`         |
| Update all     | —         | `git submodule update --remote --recursive`    |
