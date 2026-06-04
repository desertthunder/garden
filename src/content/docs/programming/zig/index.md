---
title: Zig Programming Language
---

Zig is a modern systems programming language that emphasizes safety, performance,
and interoperability.

## Imports

```zig
const std = @import("std");
```

`@import` loads another Zig module. `"std"` is Zig's standard library. The
`const std = ...` binding gives the file a short name for it.

## Public declarations

```zig
pub const Rect = struct { ... };
```

`pub` means other modules can access the declaration. Without `pub`, a name is
private to this file.

`const` means the binding itself will not change. For types, Zig usually uses
`const` declarations.

## Error sets and error unions

```zig
pub const Error = error{
    UnsupportedPlatform,
    InvalidUrl,
};

pub const Result = Error!void;
```

`error{...}` defines the possible errors for this API. `Error!void` means:

- success returns `void` (nothing)
- failure returns one of the errors in `Error`

A function like this can fail:

```zig
fn loadUrl(url: []const u8) Error!void { ... }
```

Inside tests, `try` unwraps success or returns the error from the current
function.

## Structs

```zig
pub const Rect = struct {
    x: i32 = 0,
    y: i32 = 0,
    width: u32,
    height: u32,
};
```

A `struct` groups fields. Fields can have defaults. Here `x` and `y` default to
`0`, while `width` and `height` must be provided.

Example:

```zig
const rect = Rect{ .width = 800, .height = 600 };
```

Zig uses named field initialization with `.field = value`.

## Integer types

`i32` is a signed 32-bit integer. `u32` is an unsigned 32-bit integer. Zig makes
integer sizes explicit so C ABI and platform code are easier to reason about.

## Slices

```zig
[]const u8
```

This is a read-only slice of bytes. In Zig, strings are usually `[]const u8`.
A slice stores a pointer and a length. It does not own memory by itself.

## Optional values

```zig
initial_url: ?[]const u8 = null,
```

`?T` means either a `T` or `null`. This is Zig's optional type. Here it means a
WebView may or may not start with a URL.

## Tagged unions

```zig
pub const NativeParent = union(enum) {
    gtk_widget: *anyopaque,
    raw: *anyopaque,
};
```

`union(enum)` stores exactly one variant and remembers which variant is active.
This lets us represent different kinds of native parent handles safely.

## Pointers and opaque pointers

```zig
*anyopaque
```

`*T` is a pointer to `T`. `anyopaque` means Zig does not know the pointed-to
layout. This is useful for C objects like GTK widgets, where Zig just passes a
handle through to platform code.

## Function pointer types

```zig
pub const IpcHandler = *const fn (message: []const u8) void;
```

This declares a pointer to a function. The pointed-to function takes a string
slice and returns nothing.

## Methods on structs

```zig
pub const WebView = struct {
    platform: PlatformWebView,

    pub fn loadUrl(self: *WebView, url: []const u8) Error!void {
        return self.platform.loadUrl(url);
    }
};
```

Functions declared inside a struct act like methods. The `self: *WebView`
parameter is explicit; Zig does not hide it.

A pointer receiver lets the method mutate the WebView or call other mutating
methods.

## Discarding unused values

```zig
_ = self;
```

Zig requires every value to be used. Assigning to `_` says the unused value is
intentional. This is common while scaffolding code.

## Tests

```zig
test "empty URL is invalid before platform work" {
    var webview = WebView{ .platform = .{} };
    try std.testing.expectError(error.InvalidUrl, webview.loadUrl(""));
}
```

`test` blocks are compiled and run by `zig build test`.
`std.testing` contains helpers like `expectEqual` and `expectError`.
