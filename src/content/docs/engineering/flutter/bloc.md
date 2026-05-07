---
title: BLoC
---

BLoC means Business Logic Component. In Flutter, it usually refers to the `bloc` and
`flutter_bloc` packages. It produces a state management style where UI sends intent into
a component and listens to emitted states.

The goal is to keep screen widgets focused on rendering and route side effects through a
predictable state machine.

## Core Shape

A BLoC has inputs and outputs.

```text
event -> bloc -> state
```

For simpler cases, a `Cubit` uses methods instead of events.

```text
method call -> cubit -> state
```

Both are streams of immutable state. Widgets rebuild when selected state changes.

## Cubit

A `Cubit` exposes functions that call `emit`.

```dart
class CounterCubit extends Cubit<int> {
  CounterCubit() : super(0);

  void increment() => emit(state + 1);
}
```

Cubit is a good default for local or moderately complex state because there are no event
classes or event handlers, and a direct API.

## Bloc

A `Bloc` receives events and maps them to states.

```dart
sealed class CounterEvent {}

final class CounterIncrementPressed extends CounterEvent {}

class CounterBloc extends Bloc<CounterEvent, int> {
  CounterBloc() : super(0) {
    on<CounterIncrementPressed>((event, emit) {
      emit(state + 1);
    });
  }
}
```

Bloc is useful when the event history matters. The triggering event is part of each transition, which helps debugging and observability.

Bloc also fits flows that need event transformation, like debouncing search, dropping
repeated events, canceling stale requests, sequencing writes, or throttling expensive
operations.

## Flutter Widgets

`flutter_bloc` wires blocs into the widget tree.

```dart
BlocProvider(
  create: (_) => CounterCubit(),
  child: BlocBuilder<CounterCubit, int>(
    builder: (context, count) {
      return Text('$count');
    },
  ),
)
```

### Common Widgets

| Widget         | Purpose                                           |
| -------------- | ------------------------------------------------- |
| `BlocProvider` | Creates or exposes a bloc/cubit to descendants    |
| `BlocBuilder`  | Rebuilds UI from state                            |
| `BlocSelector` | Rebuilds from a selected slice of state           |
| `BlocListener` | Runs side effects such as navigation or snackbars |
| `BlocConsumer` | Combines builder and listener                     |

Keep builders pure. Navigation, dialogs, logging, and snackbars belong in listeners or other side-effect boundaries.

## Why Use It

BLoC is a good option when state changes need to be explicit and testable.

- UI can be tested separately from state transitions.
- Business logic can run without Flutter widgets.
- State transitions are easy to exercise with unit tests.
- Events and states make loading, success, empty, and error cases visible.
- Feature modules can own their own state without a global mutable object.

The cost is boilerplate. For simple state, `setState`, `ValueNotifier`, or a small `Cubit` may be enough. Use full `Bloc` when event traceability or event stream control pays for the extra code.

## Practical Rules

- Model state as immutable data.
- Prefer one bloc/cubit per coherent feature or screen workflow.
- Keep repositories and network clients outside the bloc.
- Do not put `BuildContext` into state classes.
- Use `BlocSelector` or focused `BlocBuilder`s to limit rebuilds.
- Close blocs you create manually; `BlocProvider(create: ...)` handles this for you.

## References

- [Bloc core concepts](https://bloclibrary.dev/bloc-concepts/)
- [Flutter Bloc concepts](https://bloclibrary.dev/flutter-bloc-concepts/)
- [Flutter state management overview](https://docs.flutter.dev/data-and-backend/state-mgmt/intro)
