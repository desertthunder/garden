---
title: Regular Expressions (by Example)
tags:
  - programming
  - regex
  - search
---

A regular expression is a pattern for finding text. Different tools support
different regex features, so the same pattern may need a different flag or
regex engine depending on where it runs.

Ripgrep examples in this note use [Rust's](/programming/rust/module-system/)
`regex` crate by default. That engine is designed for predictable search time
and deliberately leaves out features such as lookaround and backreferences.[^regex]

For ripgrep-specific flags, output formats, and search behavior, see
[ripgrep](/engineering/general/ripgrep/).

## Basics

### Pattern

The regex itself. In `rg 'TODO|FIXME'`, the pattern is `TODO|FIXME`.

### Haystack

The text being searched. With ripgrep, the haystack is usually each searched
line in each searched file.

### Literal

Text that matches itself. `TODO` matches the four characters `TODO`.

### Metacharacter

A character with regex meaning, such as `|`, `(`, `)`, `[`, `]`, `*`, `+`, `?`,
`^`, `$`, and `.`.

Escape one with `\` when you need the literal character.

### Character class

A set of characters where one character may match. `[0-9]` matches one ASCII
digit. `[[:blank:]]` matches a tab or space in Rust regex syntax.[^classes]

### Quantifier

A suffix that controls repetition. `+` means one or more, `*` means zero or
more, and `?` means zero or one.[^syntax]

### Anchor

A position in the line rather than a character. `^` means the start of a line,
and `$` means the end of a line.[^syntax]

### Group

Parentheses collect part of a pattern. `(TODO|FIXME)` lets the alternation apply
to the whole set of words. Use `(?:...)` when you only need grouping and do not
need to capture the matched text.[^groups]

### Alternation

`x|y` means "match `x` or `y`". Alternation prefers the leftmost branch that
can make the overall regex match.[^alternation]

## Lookaround

Lookaround checks text near the current match position without consuming that
text. That means the lookaround can make the match succeed or fail, but the
looked-at text is not part of the returned match.

PCRE2 supports four common lookaround forms:[^pcre2]

| Form       | Name                | Meaning                                 |
| ---------- | ------------------- | --------------------------------------- |
| `(?=...)`  | Positive lookahead  | The next text must match `...`.         |
| `(?!...)`  | Negative lookahead  | The next text must not match `...`.     |
| `(?<=...)` | Positive lookbehind | The previous text must match `...`.     |
| `(?<!...)` | Negative lookbehind | The previous text must not match `...`. |

For example:

```sh
grep -P 'TODO(?=:)' notes.txt
```

This matches `TODO` only when the next character is `:`. It matches the
`TODO` in `TODO: fix parser`, but the colon is not part of the match.

Another example:

```sh
grep -P '^\s*//(?![!/])' example.zig
```

The negative lookahead `(?![!/])` checks the character after `//`. It allows
a plain `// comment`, but rejects `//!` and `///` documentation comments.

Use lookaround when you need context without including that context in the
match. If you only need to match the context too, a normal group is usually
simpler.

For example, `TODO:` is simpler than `TODO(?=:)` when matching the colon is
acceptable.

Lookaround is not part of every regex engine. In GNU grep, `-P` enables
Perl-compatible regex syntax when PCRE support is available.[^grep-pcre] In
ripgrep, `--pcre2` or `-P` enables the PCRE2 engine.

## Backreferences

A backreference matches the same text that an earlier capture group matched.

For example:

```sh
grep -P '\b([A-Za-z]+)\s+\1\b' notes.txt
```

### Breakdown

- `\b` starts at a word boundary.
- `([A-Za-z]+)` captures one ASCII word.
- `\s+` matches one or more whitespace characters.
- `\1` matches the exact text captured by the first group.
- The final `\b` ends at a word boundary.

This finds repeated words such as `the the` and `parser parser`.
It does not match `the them`, because `\1` must match the exact
text captured by `([A-Za-z]+)`.

Named groups can make backreferences clearer:

```sh
grep -P '\b(?<word>[A-Za-z]+)\s+\k<word>\b' notes.txt
```

Here, `(?<word>[A-Za-z]+)` captures a word into a group named `word`, and `\k<word>`
matches that same captured text.

PCRE2 supports numeric and named backreference forms, including
`\1`, `\g{1}`, and `\k<name>`.[^backrefs]

Backreferences are useful for duplicate detection and "same thing appears
again" checks. They are not part of every regex engine; ripgrep's default
Rust regex engine does not support them.[^regex]

## Finding TODO Comments

```sh
rg --no-messages --vimgrep -H --column --line-number \
    --color never \
    -e '(TODO|FIXME|BUG|HACK|XXX)' .
```

### regex

```regex
(TODO|FIXME|BUG|HACK|XXX)
```

### Breakdown

- `(...)` groups the alternatives so they behave as one unit.
- `TODO|FIXME|BUG|HACK|XXX` matches any one of those literal words.
- Each word is a literal. The `|` characters are metacharacters that separate
  alternatives.

This is intentionally broad. It will match `TODO` anywhere on a line, including
inside code, strings, prose, and comments. That can be useful for a first pass
because it has very few assumptions.

### Command

- `-e` provides the search pattern. This is useful when the pattern starts with
  `-` or when a command has several patterns.
- `--vimgrep` prints matches in a Vim-friendly shape: file, line, column, and
  matched line.
- `-H`, `--line-number`, and `--column` force file names, line numbers, and
  columns in the output.
- `--no-messages` hides some file access errors.
- `--color never` keeps output plain for scripts or editor integrations.

## Finding TODO Comments After Comment Prefixes

```sh
TAGS='BUG|HACK|FIXME|TODO|XXX|\[ \]|\[x\]'
PREFIX='//|#|<!--|;|/\*|^|^[[:blank:]]*(-|[0-9]+\.)'

rg --no-messages --vimgrep -H --column --line-number --color never \
    --max-columns=1000 --no-config \
    -e "(${PREFIX})[[:space:]]*(${TAGS})" \
    -g '!**/.git/**' \
    -g '!**/node_modules/**' \
    -g '!**/target/**' \
    -g '!**/.build/**' \
    .
```

### regex

```regex
(//|#|<!--|;|/\*|^|^[[:blank:]]*(-|[0-9]+\.))[[:space:]]*(BUG|HACK|FIXME|TODO|XXX|\[ \]|\[x\])
```

#### `TAGS`

```regex
BUG|HACK|FIXME|TODO|XXX|\[ \]|\[x\]
```

### Breakdown

- `BUG`, `HACK`, `FIXME`, `TODO`, and `XXX` are literal tag words.
- `|` means any one of those tags may match.
- `\[` and `\]` match literal square brackets. Without the backslashes, `[` and
  `]` would start and end a character class.
- `\[ \]` matches the unchecked Markdown task marker `[ ]`.
- `\[x\]` matches the checked Markdown task marker `[x]`.

#### `PREFIX`

```regex
//|#|<!--|;|/\*|^|^[[:blank:]]*(-|[0-9]+\.)
```

### Breakdown

- `//` matches slash-style comments in languages like JavaScript, Rust, Go,
  Zig, C, and C++.
- `#` matches hash-style comments in shells, Python, Ruby, YAML, and many config
  files.
- `<!--` matches the start of an HTML or Markdown HTML comment.
- `;` matches semicolon comments used in formats such as Lisp and INI-like
  files.
- `/\*` matches the start of a block comment, `/*`. The `*` is escaped because
  bare `*` means "repeat the previous thing zero or more times".
- `^` matches the beginning of the line. In this pattern, it allows bare tags at
  the start of a line, not just tags after comment syntax.
- `^[[:blank:]]*(-|[0-9]+\.)` matches Markdown list markers at the start of a
  line:
  - `^[[:blank:]]*` means start of line, then zero or more spaces or tabs.
  - `-` matches a bullet marker.
  - `[0-9]+\.` matches a numbered marker like `1.` or `23.`. `[0-9]+` means one
    or more ASCII digits, and `\.` matches a literal dot.

### The Middle

```regex
[[:space:]]*
```

`[[:space:]]` is an ASCII whitespace class in Rust regex syntax. It includes
space, tab, new line, vertical tab, form feed, and carriage return.[^classes]
The `*` allows zero or more whitespace characters between the prefix and tag.

For normal ripgrep line searches, this effectively means "allow optional spacing
before the tag." Newline is part of the class definition, but ripgrep searches
line by line unless multiline mode is enabled.

### Why The Whole Pattern Is Grouped

```regex
(${PREFIX})[[:space:]]*(${TAGS})
```

The first group isolates the prefix alternatives. The second group isolates the
tag alternatives. Without those groups, the `|` operators would make the overall
pattern harder to reason about because alternation binds loosely: `a|bc` means
`a` or `bc`, not `(a|b)c`.

## Finding Plain Zig Comments

```sh
rg -n --pcre2 '^\s*//(?![!/])' -g '*.zig'
```

The regex:

```regex
^\s*//(?![!/])
```

Breakdown:

- `^` anchors the match at the start of the line.
- `\s*` matches zero or more whitespace characters.
- `//` matches the literal comment prefix.
- `(?![!/])` is a negative lookahead. It says: at this position, the next
  character must not match `[!/]`.
- `[!/]` is a character class matching either `!` or `/`.

This matches ordinary Zig line comments like:

```zig
// regular comment
```

It does not match documentation comments like:

```zig
//! module doc comment
/// declaration doc comment
```

The `--pcre2` flag is required because ripgrep's default regex engine does not
support look-around. PCRE2 supports negative lookahead with `(?!...)`.[^pcre2]

## Practical Rules

Start with the simplest regex flavor your tool supports. Reach for PCRE-style
features like lookahead, lookbehind, and backreferences when they make the
pattern clearer or when the simpler engine cannot express the check.

In ripgrep, the default engine handles many everyday patterns. Use `-P` or
`--pcre2` when you need PCRE2 features.[^ripgrep]

Prefer obvious literal pieces. `TODO|FIXME` is easier to maintain than a clever
pattern that saves a few characters.

Escape punctuation when you mean the punctuation itself. `\.` means a literal
dot, while `.` means any non-newline character in the default engine.[^syntax]

Use anchors to encode position. `TODO` can match anywhere, while `^TODO` only
matches at the beginning of a line.

Use character classes for "one of these characters" and alternation for "one of
these words or phrases." `[0-9]` chooses one digit. `TODO|FIXME` chooses one
word.

Use non-capturing groups, `(?:...)`, when you need grouping for precedence but
do not need to extract the group later.

[^regex]: `regex` crate documentation. <https://docs.rs/regex/latest/regex/>. Accessed 7 June 2026.

[^syntax]: `regex` crate syntax reference. <https://docs.rs/regex/latest/regex/#syntax>. Accessed 7 June 2026.

[^classes]: `regex` crate character class reference. <https://docs.rs/regex/latest/regex/#character-classes>. Accessed 7 June 2026.

[^groups]: `regex` crate grouping and flags reference. <https://docs.rs/regex/latest/regex/#grouping-and-flags>. Accessed 7 June 2026.

[^alternation]: `regex` crate composites reference. <https://docs.rs/regex/latest/regex/#composites>. Accessed 7 June 2026.

[^pcre2]: PCRE2 syntax reference, "Lookahead and Lookbehind Assertions." <https://pcre2project.github.io/pcre2/doc/pcre2syntax/#SEC21>. Accessed 7 June 2026.

[^backrefs]: PCRE2 syntax reference, "Backreferences." <https://pcre2project.github.io/pcre2/doc/pcre2syntax/#SEC23>. Accessed 7 June 2026.

[^grep-pcre]: GNU Grep manual, "Regular Expressions." <https://www.gnu.org/s/grep/manual/html_node/Regular-Expressions.html>. Accessed 7 June 2026.

[^ripgrep]: BurntSushi. `ripgrep` README. <https://github.com/BurntSushi/ripgrep>. Accessed 7 June 2026.
