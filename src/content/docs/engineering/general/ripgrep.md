---
title: Ripgrep
---

Ripgrep is a line-oriented search tool that recursively searches directories for regex patterns[^1].
It's designed for speed and respects .gitignore rules when searching within git repositories.

## Case Sensitivity

Ripgrep supports three case sensitivity modes:

Smart Case (`--smart-case`) is case-insensitive unless the pattern contains uppercase letters.
Pattern `hello` matches "hello", "Hello", "HELLO" while pattern `Hello` only matches "Hello".

Case Insensitive (`--ignore-case` or `-i`) is always case-insensitive regardless of pattern.
Pattern `Hello` matches "hello", "Hello", "HELLO".

Case Sensitive (`--case-sensitive` or `-s`) is always case-sensitive.
Pattern `hello` only matches "hello".

## Core Flags

JSON Output (`--json`) outputs results in JSON format with structured data for programmatic parsing.
Each line is a JSON object representing different message types.

```bash
rg --json "pattern" files...
```

Respect Gitignore (`--no-require-git`) makes ripgrep respect .gitignore rules even when searching outside of a git repository.

```bash
rg --no-require-git "pattern" files...
```

## Pattern Types

Regex mode is the default[^2]. Standard regex patterns work out of the box:

```bash
rg "TODO|FIXME" notes/
```

Fixed Strings mode (`--fixed-strings` or `-F`) treats the pattern as a literal string rather than regex.
Useful when searching for special characters that would otherwise need escaping:

```bash
rg -F "function()" notes/
```

PCRE2 Engine (`--pcre2`) uses PCRE2 for advanced regex features like lookbehind, lookahead, and backreferences[^3]:

```bash
rg --pcre2 "(?<=TODO: )\w+" notes/
```

## Context Lines

Shows N lines before and after each match:

```bash
rg -C 3 "pattern" notes/
```

Available options:

- `-A N`: N lines after the match
- `-B N`: N lines before the match
- `-C N`: N lines before and after the match

## JSON Output Format

When using `--json`, ripgrep outputs newline-delimited JSON messages.

Message types include:

begin - Start of results for a file:

```json
{
  "type": "begin",
  "data": {
    "path": {"text": "/path/to/note.md"}
  }
}
```

match - A search match:

```json
{
  "type": "match",
  "data": {
    "path": {"text": "/path/to/note.md"},
    "lines": {"text": "This line contains the match\n"},
    "line_number": 42,
    "submatches": [{"start": 15, "end": 20}]
  }
}
```

context - Context lines (when using `-C`, `-A`, or `-B`):

```json
{
  "type": "context",
  "data": {
    "path": {"text": "/path/to/note.md"},
    "lines": {"text": "context line before match\n"},
    "line_number": 41
  }
}
```

end - End of results for a file:

```json
{
  "type": "end",
  "data": {
    "path": {"text": "/path/to/note.md"}
  }
}
```

summary - Final statistics:

```json
{
  "type": "summary",
  "data": {
    "elapsed_total": {"secs": 0, "nanos": 123456},
    "stats": {
      "matched_lines": 5,
      "matches": 7
    }
  }
}
```

## Exit Codes

Ripgrep uses exit codes to indicate search status:

- 0: Matches found (success)
- 1: No matches found (not an error)
- 2+: Error occurred (file not found, permission denied, etc.)

When using ripgrep programmatically, exit code 1 should be treated as success (just no results).

## Performance

Operating systems impose limits on command-line argument length. When searching thousands of files, split them into batches.
A chunk size of 1000 files per invocation is a safe default.

Process JSON output line-by-line rather than reading all results into memory:

```bash
rg --json "pattern" notes/ | while IFS= read -r line; do
  echo "$line" | jq '.type'
done
```

[^1]: BurntSushi. Ripgrep. GitHub.
<https://github.com/BurntSushi/ripgrep>. Accessed 27 Dec 2025.
[^2]: Regular-Expressions.info. Regex Tutorial.
<https://www.regular-expressions.info/>. Accessed 27 Dec 2025.
[^3]: PCRE - Perl Compatible Regular Expressions.
<https://www.pcre.org/current/doc/html/>. Accessed 27 Dec 2025.
<https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md>. Accessed 27 Dec 2025.
