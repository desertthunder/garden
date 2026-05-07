---
title: Dart
---

Dart is a typed, object-oriented language used for Flutter, command-line tools, servers,
and web apps. It feels familiar if you know JavaScript, Java, C#, Kotlin, or Swift, with
classes, generics, async primitives, lexical closures, and package imports all part of
the core language.

Every Dart program starts at `main`.

```dart
void main() {
  print('Hello, Dart');
}
```

## Variables

Dart has type inference, so local code often uses `var` while public APIs usually spell out types.

```dart
var name = 'Ada';        // inferred as String
String handle = 'ada';   // explicit String
final id = 'did:plc:1';  // assigned once at runtime
const limit = 100;       // compile-time constant
dynamic value = 'loose'; // opts out of static checking
```

Use `final` for values that should not be reassigned. Use `const` when the value can be created at compile time. Reach for `dynamic` only when crossing a truly dynamic boundary such as loosely typed JSON or interop.

## Null Safety

Dart is non-nullable by default.

```dart
String name = 'Ada';
String? nickname;

if (nickname != null) {
  print(nickname.toUpperCase());
}
```

`String` cannot contain `null`. `String?` can. This is sound null safety, as the
analyzer and compiler can reject many null mistakes before runtime.

Useful operators:

```dart
final displayName = nickname ?? name;
final length = nickname?.length;
final forced = nickname!;
```

`!` is a promise that the value is not null. It is useful at trusted boundaries, but it moves the failure back to runtime.

## Collections

Lists, sets, and maps have literal syntax.

```dart
final numbers = <int>[1, 2, 3];
final tags = <String>{'flutter', 'dart'};
final counts = <String, int>{'likes': 12, 'reposts': 3};
```

Collection literals support conditions and loops.

```dart
final visible = [
  'home',
  if (isSignedIn) 'profile',
  for (final item in extraTabs) item,
];
```

## Functions

Functions are first-class values. They can be named, anonymous, or written as single-expression arrow functions.

```dart
int add(int a, int b) => a + b;

final doubled = [1, 2, 3].map((n) => n * 2).toList();
```

Dart has positional parameters, optional positional parameters, and named parameters.

```dart
void log(String message, [String level = 'info']) {}

void createPost({required String text, String? replyTo}) {}
```

Named parameters make call sites readable when a function takes multiple related values.

## Classes

Classes are the standard unit for data and behavior.

```dart
class Profile {
  Profile({required this.did, required this.handle});

  final String did;
  final String handle;

  String get mention => '@$handle';
}
```

Dart supports single inheritance, interfaces through `implements`, abstract classes, mixins, extension methods, enhanced enums, and sealed class hierarchies.

```dart
sealed class LoadState {}

final class Loading extends LoadState {}

final class Loaded extends LoadState {
  Loaded(this.items);
  final List<String> items;
}
```

Sealed classes pair well with pattern matching.

```dart
switch (state) {
  case Loading():
    print('loading');
  case Loaded(:final items):
    print(items.length);
}
```

## Async

Dart uses `Future` for one eventual value and `Stream` for a sequence of asynchronous values.

```dart
Future<String> fetchName() async {
  final response = await client.get('/profile');
  return response.name;
}

Stream<int> ticks() async* {
  for (var i = 0; i < 3; i++) {
    yield i;
  }
}
```

Flutter code uses these constantly for network requests, database work, timers, subscriptions, and UI state that arrives later.

## Imports

Dart imports core libraries, packages, and local files.

```dart
import 'dart:math' as math;
import 'package:http/http.dart' as http;
import 'src/profile.dart';
```

Package code is resolved through `pubspec.yaml` and `pub.dev`.

## References

- [Learn Dart in Y Minutes](https://learnxinyminutes.com/dart/)
- [Dart language tour](https://dart.dev/language)
- [Sound null safety](https://dart.dev/null-safety)
- [Asynchronous programming](https://dart.dev/language/async)
- [Patterns](https://dart.dev/language/patterns)
