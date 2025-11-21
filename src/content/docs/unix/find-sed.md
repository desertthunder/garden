---
title: find & sed
---

The `find` and `sed` commands are powerful tools in Linux for searching and manipulating text.

Here's an overview related to how I used them both to rename specific words in multiple files.
Basically, I wanted to change all instances of "loose" to "relaxed" in text files within a project.

## `find` + `sed` Pattern

```sh
find [path] [filters] -exec sed -i '' 's/old/new/g' {} +
```

### Components

**find**: Locate files matching criteria

- `-name "*.ext"`: Filter by filename pattern
- `-type f`: Only regular files (not directories)
- `-exec cmd {} +`: Run command on all found files

**sed**: *S*tream *ed*itor for text replacement

- `-i ''`: Edit in-place (macOS syntax)
    - On Linux, use `-i` without quotes
- `s/pattern/replacement/g`: *s*ubstitute *g*lobally
- `\b`: Word boundary (prevents partial matches)

**{}**: Placeholder for filenames found by find
**+**: Batch multiple files (efficient) vs `;` (one at a time)

## Patterns

### Word Boundaries

```sh
# WITHOUT \b: "loosely" → "relaxedly" (wrong!)
sed 's/loose/relaxed/g'

# WITH \b: Only "loose" → "relaxed" (correct!)
sed 's/\bloose\b/relaxed/g'
```

### Case Sensitivity

```sh
# Separate patterns for different cases
sed 's/\bLoose mode\b/Relaxed mode/g'  # Capital L
sed 's/\bloose mode\b/relaxed mode/g'  # Lowercase l
```

### Delimiters

```sh
# When pattern contains /, use different delimiter
sed 's|path/to/loose|path/to/relaxed|g'  # Using | instead of /
```
