---
title: Golden Tests
---

Golden tests compare current program output against a previously approved
reference artifact. That artifact is usually called a **golden file**,
**snapshot**, **baseline**, or **approved output**.

The basic loop:

1. Run code against a controlled input.
2. Capture the output.
3. Compare it to a checked-in reference file.
4. Fail the test if the output differs.
5. Review the diff.
6. Either fix the regression or approve the new golden.

This makes golden tests a good fit for behavior that is easier to inspect
visually or as output than to assert field-by-field.

## Terminology

| Term                   | Meaning                                                     |
| ---------------------- | ----------------------------------------------------------- |
| Golden file            | Checked-in reference output used as the expected result.    |
| Snapshot               | Serialized reference value, often text or structured data.  |
| Approval test          | Test where a human approves the captured output as correct. |
| Visual regression test | Golden test where the reference is usually an image.        |
| Characterization test  | Test that captures current behavior, often for legacy code. |

The names overlap but in practice, **golden test** is common in compiler, CLI, and
renderer contexts; **snapshot test** is common in many language ecosystems;
**approval test** emphasizes the human review workflow.

## The central idea

A normal unit test says:

```text
For this input, this specific property must hold.
```

A golden test says:

```text
For this input, the whole produced artifact should still match this approved artifact.
```

This is useful when the output is large enough that many small assertions
would obscure the intent.

Most snapshot testing tools follow the same pattern: render or produce a
value, store a reference on first run, and compare on subsequent runs. If
the values differ, either the implementation changed intentionally and the
reference must be updated, or the new output reveals a bug.[^1]

The same pattern applies for file outputs: tests generate output files,
compare them to checked-in golden versions, and fail when they differ.[^2]

## Use Cases

Golden tests work best when the output is important, reviewable, and
deterministic.

## Golden tests are regression nets

Golden tests are especially useful when refactoring code that already works.
Approval testing documentation describes approval tests as taking a snapshot
of results and confirming that they have not changed; this is useful when
asserting complex objects or rich output directly would be awkward.[^3]

## Determinism

Golden tests need stable output.

Generated values like dates and IDs are a common source of unstable snapshots.
Use matchers, serializers, or explicit replacement for any non-deterministic
segments.[^4]

I prefer to use golden tests for **interfaces**, not internals.

## References

[^1]: Jest, "Snapshot Testing." <https://jestjs.io/docs/snapshot-testing>
[^2]: `goldenfile` crate docs. <https://docs.rs/goldenfile/latest/goldenfile/>
[^3]: ApprovalTests.com. <https://approvaltests.com/>
[^4]: Jest, "Snapshot Testing - Property Matchers." <https://jestjs.io/docs/snapshot-testing#property-matchers>
