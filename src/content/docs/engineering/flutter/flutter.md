---
title: Flutter
---

Flutter is a UI toolkit for building apps from one Dart codebase. It targets iOS, Android, web, Windows, macOS, and Linux.

The core idea is to write a widget tree in Dart, update state, and let Flutter rebuild the affected parts of the UI.

```dart
class CounterText extends StatelessWidget {
  const CounterText({super.key, required this.count});

  final int count;

  @override
  Widget build(BuildContext context) {
    return Text('Count: $count');
  }
}
```

## How It Works

Flutter is layered.

- The Dart app owns widgets and business logic.
- The Flutter framework provides widgets, gestures, animation, layout, accessibility, and painting APIs.
- The engine rasterizes composited scenes and exposes low-level primitives through `dart:ui`.
- The embedder connects Flutter to the host platform for input, accessibility, rendering surfaces, lifecycle, and platform services.

Widgets are immutable descriptions. Flutter keeps a persistent element tree under them, so rebuilding widgets does not mean throwing away the whole rendered app. A changed widget configuration updates elements and render objects where needed.

The layout model is constraint based.

```text
parent constraints go down
child sizes go up
parent sets position
```

Most UI is drawn by Flutter rather than by native platform controls. Platform views exist for embedding native controls, but they are integration points rather than the default rendering model.

## Why It Works Well

Flutter is good when you want tight control over UI and behavior across platforms.

- The same widget and rendering model runs across targets.
- Hot reload makes UI iteration fast during development.
- The framework ships rich Material and Cupertino libraries.
- Dart gives Flutter a sound type system, async primitives, and ahead-of-time compilation for release builds.
- Custom UI, animation, and drawing are first-class rather than escape hatches.

The tradeoff is that Flutter apps bring their own rendering stack. That can increase binary size, and native platform controls may need plugins or platform views when exact host behavior matters.

## Flutter vs React Native

Flutter and React Native are both cross-platform app frameworks, but their rendering models differ.

| Area               | Flutter                                         | React Native                                              |
| ------------------ | ----------------------------------------------- | --------------------------------------------------------- |
| Language           | Dart                                            | JavaScript or TypeScript                                  |
| UI model           | Flutter widgets rendered by Flutter             | React components backed by native platform views          |
| Rendering          | Engine draws the app's composited scene         | Native components are created and updated by React Native |
| Styling            | Flutter widget properties and themes            | React-style component props and style objects             |
| Native integration | Plugins, platform channels, FFI, platform views | Native modules and native components                      |
| Strength           | Consistent custom UI and animation              | Fits React teams and native-view integration              |

React Native's New Architecture removed the old bridge bottleneck and added newer
native module and component systems. That narrows some historical differences, but the
mental model is still different, as React Native coordinates native views from React,
while Flutter owns a rendering pipeline and paints its own UI.

Pick Flutter when a consistent product surface, custom visuals, and one rendering model
matter most. Pick React Native when React expertise, JavaScript ecosystem fit, or direct
native-view behavior are stronger constraints.

## References

- [Flutter architectural overview](https://docs.flutter.dev/resources/architectural-overview)
- [Flutter for React Native developers](https://docs.flutter.dev/get-started/flutter-for/react-native-devs)
- [React Native components](https://reactnative.dev/docs/intro-react-native-components)
- [React Native architecture overview](https://reactnative.dev/architecture/overview)
- [React Native New Architecture](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)
