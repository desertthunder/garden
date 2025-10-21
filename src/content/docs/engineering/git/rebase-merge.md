---
title: Rebasing & Merging
---

## `cherry-pick`

- `git cherry-pick <commit>` lets you **selectively apply** a specific commit (or range of commits) from one branch into the current branch[^1].
- Creates a **new commit** on the current branch that has the same change as the picked commit(s) but a different commit hash[^2].

### Basic Commands

```sh
# Switch to target branch (where you want to apply the commit)
git checkout <target-branch>

# Apply a single commit (by its SHA)
git cherry-pick <commit-SHA>

# Apply a range of commits
git cherry-pick <start-SHA>..<end-SHA>

# If you want to apply the changes but not auto-commit them:
git cherry-pick -n <commit-SHA>

# If conflicts occur:
git cherry-pick --continue   # after resolving
git cherry-pick --abort      # to cancel
```

### Useful Options

- `-x` : append "(cherry picked from commit …)" to the commit message.
- `--edit` (`-e`) : edit the commit message.
- `--signoff` (`-s`) : add a "Signed-off-by" footer.
- `--allow-empty` : allow cherry-picking a commit that results in no changes.

## `rebase`

- `git rebase <base-branch>` takes the commits in your current branch and **replays** them on top of another branch (changing their base)[^3].
- It **rewrites history**: the commits get new parent(s), new commit hashes[^2].
- Use-cases:

  - When you want to bring your feature branch up-to-date with `main` or `master`, and you prefer a cleaner, linear history.
  - Before merging a feature branch, to "clean up" or squash commits[^4].
- **Pros**: Linear history, no merge commits cluttering the log.
- **Cons**: Because history is rewritten, it’s dangerous (or requires care) if the branch is shared/collaborative-can cause divergent histories.

### Basic Commands

```sh
# Switch to your feature branch
git checkout <feature-branch>

# Rebase onto the latest main or master branch
git rebase <base-branch>

# If there are multiple commits you’d like to rebase interactively (reorder/squash/edit):
git rebase -i <base-branch>   # or git rebase -i HEAD~N

# Continuing after conflict resolution:
git rebase --continue

# Abort the rebase (go back)
git rebase --abort
```

### Useful Options

- `-i` / `--interactive`: Allows you to pick, squash, reword, drop commits in your editor

## `merge`

- `git merge <branch>` combines the changes from another branch into your current branch, creating a **merge commit** (unless it’s a fast-forward).
- Keeps the original commit history intact (no rewriting of existing commits)

### Basic Commands

```sh
# Switch to the branch you want to integrate into (e.g., main)
git checkout <target-branch>

# Merge the other branch (feature) into target
git merge <feature-branch>

# If you want to force a merge commit even when fast-forward is possible:
git merge --no-ff <feature-branch>

# If you want to allow only a fast-forward merge (and fail if not possible):
git merge --ff-only <feature-branch>
```

### Fast-Forward

- A fast-forward merge happens when the branch you're merging *into* has no new commits since the branch you are merging *from* diverged.
    - In other words, the target branch is an ancestor of the source branch.
- When that is true, Git can simply move  the pointer of the target branch to the tip of the source branch without creating a merge commit[^5].

#### Example

Suppose your `main` branch and a feature branch look like this:

```text
A - B - C   (main)
          \
           D - E  (feature)
```

If `main` hasn’t had any new commits since branching off, then when you merge feature into main, Git can do a fast-forward:

```text
A - B - C - D - E   (main, feature)
```

No merge commit is created; `main`’s pointer just moves from `C` to `E`.

#### When is fast-forward possible?

- The current HEAD of the target branch is an *ancestor* of the source branch’s tip.
    - `git merge-base <target> <source>` == `<target>` HEAD[^9].
- The target branch has not advanced since the divergence.
- There are no conflicting/parallel commits on the target branch that the source branch doesn’t have.

### Useful Options

- `git merge --ff` : allow fast-forward if possible, otherwise create a merge commit. (this is default)
- `git merge --no-ff` : always create a merge commit even if fast-forward is possible.
- `git merge --ff-only` : only allow the merge if it can be fast-forward; otherwise abort

[^1]: <https://www.atlassian.com/git/tutorials/cherry-pick> "Git Cherry Pick | Atlassian Git Tutorial"
[^2]: <https://git-scm.com/docs/git-cherry-pick> "Git - git-cherry-pick Documentation"
[^3]: <https://www.atlassian.com/git/tutorials/using-branches/git-merge> "Git Merge | Atlassian Git Tutorial"
[^4]: <https://git-scm.com/docs/git-merge> "git-merge Documentation - Git"
[^5]: <https://stackoverflow.com/questions/29673869/what-is-fast-forwarding> "What is fast-forwarding? - git - Stack Overflow"
