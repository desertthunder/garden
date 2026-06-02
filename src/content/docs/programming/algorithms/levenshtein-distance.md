---
title: Levenshtein Distance
---

Levenshtein distance measures how many single-character edits are needed to turn
one string into another.

Allowed edits:

- insert one character
- delete one character
- substitute one character for another

Example:

```text
kitten -> sitten   substitute k with s
sitten -> sittin   substitute e with i
sittin -> sitting  insert g
```

Distance: `3`

## Dynamic Programming

Let `d[i][j]` be the edit distance between:

- the first `i` characters of string `a`
- the first `j` characters of string `b`

Base cases:

```text
d[0][j] = j
d[i][0] = i
```

Those mean an empty string needs `j` insertions to become a prefix of length
`j`, and a prefix of length `i` needs `i` deletions to become empty.[^1]

Recurrence[^2]:

```py
cost = 0 if a[i - 1] == b[j - 1] else 1

d[i][j] = min(
    d[i - 1][j] + 1,        # delete
    d[i][j - 1] + 1,        # insert
    d[i - 1][j - 1] + cost  # substitute or match
)
```

The answer is `d[len(a)][len(b)]`.

## Complexity

For strings of length `m` and `n`:

- time: `O(mn)`
- memory: `O(mn)` with the full table
- memory: `O(min(m, n))` if only the previous row is kept

Use the full table when you need the edit script. Use row compression when you
only need the distance.

## Use Case

Levenshtein distance is useful for:

- spell correction
- fuzzy search
- typo tolerance
- approximate matching
- comparing biological or symbolic sequences

[^1]: V. I. Levenshtein, "Binary Codes Capable of Correcting Deletions, Insertions, and Reversals", 1966 English translation of the 1965 Russian paper. <https://nymity.ch/sybilhunting/pdf/Levenshtein1966a.pdf>

[^2]: Robert A. Wagner and Michael J. Fischer, "The String-to-String Correction Problem", Journal of the ACM, 1974.
