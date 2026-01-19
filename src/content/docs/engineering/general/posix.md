---
title: POSIX
---

The POSIX (Portable Operating System Interface) standard defines strict conventions for command-line utilities to ensure consistency and interoperability (e.g., pipability).
Key requirements from [IEEE Std 1003.1-2017](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html) include:

## Option Syntax

- **Short Options**: Options should be single alphanumeric characters preceded by `-` (e.g., `-a`).
- **Option Grouping**: Multiple short options with no arguments should be groupable (e.g., `-abc` is equivalent to `-a -b -c`).
- **Option Arguments**: Options requiring arguments should accept them separated by space (e.g., `-o file`) or attached (e.g., `-ofile`).
- **Long Options**: While POSIX strictly defines short options, GNU conventions (double-hyphen `--option`) are widely accepted extensions in the Linux/Unix ecosystem.
  POSIX compliance usually implies supporting the short forms _at minimum_.

## Standard Input/Output

- **Stdin as Operator**:
  If a file operand is notably absent, or if the operand is explicitly `-`, the utility should read from standard input.
- **Stdout/Stderr Separation**:
  Diagnostic messages must go to `stderr`, while actual data output goes to `stdout`.
- **Pipability**:
  Output format should be text-stream friendly unless a specific format (like JSON) is requested.

## End of Options

- **Delimiter**: The `--` argument must be recognized as the end of options.
  Everything following it is treated as an operand (filename), even if it starts with `-`.

## Exit Status

- **0**: Success.
- **>0**: Failure.
  Distinct codes should be used for different error types if possible (e.g., syntax error vs runtime error), though POSIX only strictly mandates 0 for success.
