---
title: Zig's Build System
---

Zig projects will generally have two build-related files:

- `build.zig`: executable Zig code that defines build steps
- `build.zig.zon`: package metadata in Zig Object Notation

## `build.zig`

Zig's build system is written in Zig. The build runner calls this function:

```zig
pub fn build(b: *std.Build) void {
    ...
}
```

`b` is the build graph builder. The function does not compile immediately; it
adds modules, artifacts, and steps to a graph that Zig runs afterward.

## Standard target option

```zig
const target = b.standardTargetOptions(.{});
```

This creates the usual `-Dtarget=...` option. If you do not pass one, Zig builds
for the current machine.

Examples:

```sh
zig build test
zig build test -Dtarget=x86_64-linux-gnu
```

## Standard optimize option

```zig
const optimize = b.standardOptimizeOption(.{});
```

This creates the usual `-Doptimize=...` option.

Common values:

- `Debug`
- `ReleaseSafe`
- `ReleaseFast`
- `ReleaseSmall`

Example:

```sh
zig build test -Doptimize=ReleaseSafe
```

## Adding a module

```zig
const wrz = b.addModule("wrz", .{
    .root_source_file = b.path("src/root.zig"),
    .target = target,
    .optimize = optimize,
});
```

A module is importable Zig code. This says:

- the module name is `wrz`
- its root file is `src/root.zig`
- it should compile for the selected target
- it should use the selected optimize mode

Later, another Zig package could import this module as `wrz`.

## Adding tests

```zig
const tests = b.addTest(.{ .root_module = wrz });
```

This creates a test artifact from the `wrz` module. Zig compiles all reachable
`test` blocks in that module.

## Running test artifacts

```zig
const run_tests = b.addRunArtifact(tests);
```

`addTest` creates the test program. `addRunArtifact` creates a build step that
runs it.

## Creating the `test` step

```zig
const test_step = b.step("test", "Run library tests");
test_step.dependOn(&run_tests.step);
```

This defines the command:

```sh
zig build test
```

The dependency means the `test` step must run the compiled test artifact.

## `build.zig.zon`

`build.zig.zon` is package metadata. ZON looks like Zig literals, but it is data
rather than executable code.

Current file:

```zig
.{
    .name = .wrz,
    .version = "0.0.1",
    .minimum_zig_version = "0.16.0",
    .paths = .{""},
    .fingerprint = 0x3262491be5b487a,
}
```

Field meanings:

- `.name`: package name
- `.version`: package version
- `.minimum_zig_version`: lowest Zig version expected to work
- `.paths`: files/directories included in the package
- `.fingerprint`: generated package identity value

## Commands to know

```sh
zig build test        # run tests
zig build --help      # show options and steps
zig build test -freference-trace
```

`-freference-trace` is useful when Zig gives a long type or compile error. It
shows more of the chain that caused the error.
