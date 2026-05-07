---
title: Dependency Injection
---

Dependency Injection is a way to give an object its dependencies from the outside instead of letting it construct them itself.

```dart
class ProfileRepository {
  ProfileRepository(this.client);

  final ApiClient client;
}
```

`ProfileRepository` needs an `ApiClient`, but it does not decide which one to use. That decision belongs at the edge of the application.

## Why Use It

Dependency Injection makes dependencies explicit.

- Constructors show what a class needs.
- Tests can pass fake or in-memory implementations.
- Production startup can choose concrete implementations.
- Classes stay focused on behavior instead of object construction.

It also avoids hidden global access. A class that reaches into a global registry can work, but its real requirements are harder to see.

## Constructor Injection

Constructor injection is the usual default because it creates valid objects up front.

```dart
abstract interface class Clock {
  DateTime now();
}

class SystemClock implements Clock {
  @override
  DateTime now() => DateTime.now();
}

class TokenRefresher {
  TokenRefresher({required this.clock});

  final Clock clock;

  bool isExpired(DateTime expiresAt) => !clock.now().isBefore(expiresAt);
}
```

Tests can pass a fake clock without changing `TokenRefresher`.

```dart
class FixedClock implements Clock {
  FixedClock(this.value);

  final DateTime value;

  @override
  DateTime now() => value;
}
```

## Setter Injection

Setter injection is useful for optional dependencies or framework-created objects, but it allows an object to exist before all collaborators are available.

```java
class ReportController {
    private AuditLogger auditLogger = AuditLogger.noop();

    void setAuditLogger(AuditLogger auditLogger) {
        this.auditLogger = auditLogger;
    }
}
```

If the dependency is required for correctness, prefer the constructor.

## Composition Root

The composition root is the place where object graphs are assembled. It should be close to application startup.

```dart
Future<void> main() async {
  final client = ApiClient(baseUrl: Uri.parse('https://api.example.com'));
  final repository = ProfileRepository(client);
  final bloc = ProfileBloc(repository);

  runApp(App(profileBloc: bloc));
}
```

Keep container calls and manual wiring in this area. Feature classes should receive dependencies, not reach back into the composition root.

## Pure DI and Containers

Pure DI wires objects with normal language constructs.

```kotlin
val httpClient = HttpClient()
val userRepository = UserRepository(httpClient)
val controller = UserController(userRepository)
```

This is strongly typed and easy to follow. The cost is maintenance as object graphs grow.

A DI container or code generator can assemble the graph for you. That helps when there are many services, repeated lifetimes, or conventions. The cost is learning the tool and losing some directness. A container is most useful when it removes real composition work, not when it only replaces a few `new` calls.

## Guidelines

- Inject dependencies, not primitive configuration scattered across the codebase.
- Keep required dependencies in constructors.
- Keep object creation at the composition root.
- Avoid passing a container into ordinary classes.
- Prefer small interfaces at boundaries where substitution matters.
- Do not introduce interfaces only because a DI tool expects them.

## References

- [Composition Root](https://blog.ploeh.dk/2011/07/28/CompositionRoot/)
- [When to use a DI Container](https://blog.ploeh.dk/2012/11/06/WhentouseaDIContainer/)
- [Inversion of Control Containers and the Dependency Injection pattern](https://martinfowler.com/articles/injection.html)
