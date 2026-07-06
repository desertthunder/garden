---
title: Symlinks
tags:
  - filesystems
  - symlinks
  - unix
  - paths
---

A symbolic link is a filesystem entry whose contents are a pathname to another
file or directory.[^symlink]

That makes it path-based indirection. A symlink does not duplicate the target's
contents, and it is not the same thing as a hard link. A hard link refers to the
same underlying filesystem object; a symlink points to another name.[^symlink]

## Behavior

- Deleting a symlink deletes the link, not the target.
- Moving or deleting the target can leave a dangling link.
- A symlink can point to a directory.
- A symlink can cross filesystem boundaries.
- A symlink target does not need to exist when the link is created.
- Relative symlink targets are resolved from the link's containing directory.

Most file access follows the link. `cat link-to-file` usually reads the target.
Other operations work on the link itself: `rm` removes the link, `readlink`
reads the stored path, and `lstat` stats the link rather than the target.[^symlink]

## `ln -s`

On Unix-like systems, `ln` creates links. With `-s`, it creates a symbolic link
instead of a hard link.[^ln]

```bash
ln -s target-path link-path
```

The target path is stored as given. That is why relative links are portable only
when the relationship between link and target stays the same.

## Hard Links

Hard links and symlinks solve different problems.

| Link type | Points to                 | Can cross filesystems | Can dangle |
| --------- | ------------------------- | --------------------- | ---------- |
| hard link | underlying file object    | no                    | no         |
| symlink   | pathname to another entry | yes                   | yes        |

Hard links are useful when multiple directory entries should name the same file
object. Symlinks are useful when one canonical path should be reachable from
another place or when the target may be a directory or live on another
filesystem.

## Traversal

Recursive tools need explicit symlink rules. The common convention is:

- `-P`: physical walk; do not follow symlinks during traversal.
- `-H`: follow command-line symlinks.
- `-L`: logical walk; follow symlinks encountered during traversal.

The exact behavior still depends on the tool. `rm -r symlink` removes the link
itself and does not recurse into the target directory.[^symlink]

## Uses

Symlinks are useful for compatibility paths, shared config files, generated
content trees, and making one canonical directory appear in several places.

They are also maintenance-sensitive. If a build tool, deployment system, or
backup program resolves symlinks differently than expected, the result can be a
missing file, a duplicated tree, or writes landing in the wrong location.

## Questions

- Does this project prefer relative or absolute symlink targets?
- Does the deploy target preserve symlinks or copy the referenced files?
- Does the build tool report symlinks as links, resolved targets, or both?
- Which commands in the workflow follow symlinks during recursive traversal?

[^symlink]:
    Michael Kerrisk, "symlink(7)," Linux manual page,
    <https://man7.org/linux/man-pages/man7/symlink.7.html>. Accessed 6 Jul. 2026.

[^ln]:
    IEEE and The Open Group, "`ln`," _The Open Group Base Specifications
    Issue 8_, <https://pubs.opengroup.org/onlinepubs/9799919799/utilities/ln.html>.
    Accessed 6 Jul. 2026.
