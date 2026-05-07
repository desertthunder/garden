---
title: Dependency Injection Libraries
---

Dependency Injection libraries help build object graphs. They do not replace the
underlying design rule which posits that ordinary code should declare dependencies and
receive them from the outside.

Two useful reference points are Dagger and `get_it`. Dagger is a compile-time dependency
graph tool for Java and Kotlin. `get_it` is a Dart service locator commonly used in
Flutter.

## Dagger

Dagger builds a dependency graph at compile time using annotations.

Constructor-inject classes that Dagger can create directly.

```java
final class UserRepository {
    private final ApiClient apiClient;

    @Inject
    UserRepository(ApiClient apiClient) {
        this.apiClient = apiClient;
    }
}
```

Use modules when constructor injection is not enough for interfaces, third-party
classes, and configured objects.

```kotlin
interface ApiClient {
    fun get(path: String): String
}

class HttpApiClient(private val baseUrl: String) : ApiClient {
    override fun get(path: String): String = "$baseUrl$path"
}

@Module
object NetworkModule {
    @Provides
    fun provideApiClient(): ApiClient = HttpApiClient("https://api.example.com")
}
```

A component is the graph boundary.

```kotlin
@Component(modules = [NetworkModule::class])
interface AppComponent {
    fun userRepository(): UserRepository
}
```

Dagger's main advantage is compile-time validation. Missing or invalid bindings fail the
build instead of surfacing as late runtime lookup errors.

### Costs

- Annotation processing or KSP setup.
- Generated code to understand during debugging.
- More ceremony than pure DI for small apps.
- Graph shape and scopes need care as the app grows.

## get_it

`get_it` is a service locator for Dart and Flutter. It stores factories and instances
behind a global or passed locator.

```dart
final getIt = GetIt.instance;

void configureDependencies() {
  getIt.registerLazySingleton<ApiClient>(
    () => ApiClient(baseUrl: Uri.parse('https://api.example.com')),
  );

  getIt.registerFactory<ProfileBloc>(
    () => ProfileBloc(getIt<ApiClient>()),
  );
}
```

### Common registration styles

| Registration            | Lifetime                        | Use                                             |
| ----------------------- | ------------------------------- | ----------------------------------------------- |
| `registerSingleton`     | Created immediately, reused     | Cheap service needed at startup                 |
| `registerLazySingleton` | Created on first lookup, reused | Shared service that may be expensive            |
| `registerFactory`       | New instance on each lookup     | Short-lived object such as a bloc or controller |

The practical risk is hidden dependency access.

```dart
class ProfileBloc {
  ProfileBloc() : repository = GetIt.I<ProfileRepository>();

  final ProfileRepository repository;
}
```

This works, but the constructor no longer tells the reader what `ProfileBloc` needs.
A better pattern is to use `get_it` in the composition root and keep constructor injection
inside features.

```dart
getIt.registerFactory<ProfileBloc>(
  () => ProfileBloc(repository: getIt<ProfileRepository>()),
);
```

## Choosing a Tool

Use pure DI when the graph is small enough to wire by hand.

Use Dagger when a Java or Kotlin app has a large static graph and compile-time
validation is worth the ceremony.

Use `get_it` when a Flutter app needs lightweight centralized wiring, but keep lookups
near startup. Treat it as composition infrastructure, not as a dependency access pattern
inside business objects.

## References

- [Dagger developer guide](https://dagger.dev/dev-guide/)
- [get_it getting started](https://flutter-it.dev/documentation/get_it/getting_started)
- [When to use a DI Container](https://blog.ploeh.dk/2012/11/06/WhentouseaDIContainer/)
- [Composition Root](https://blog.ploeh.dk/2011/07/28/CompositionRoot/)
