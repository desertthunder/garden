---
title: Inversion of Control
---

Inversion of Control is a design idea where code gives up control of some decision to another part of the system.

The most common example is a framework. Application code does not run the main UI loop
itself but instead registers handlers, widgets, controllers, or lifecycle methods. The
framework calls them when the right event happens.

```java
button.setOnClickListener(view -> {
    presenter.save();
});
```

The button decides when the callback runs. The application supplies the behavior.

## Control Being Inverted

Without inversion, a caller controls the whole flow.

```java
class ImportJob {
    void run() {
        FileReader reader = new FileReader("input.csv");
        List<Row> rows = reader.read();
        Database database = new Database();
        database.save(rows);
    }
}
```

With inversion, the job can be controlled by code outside it.

```java
interface RowReader {
    List<Row> read();
}

interface RowStore {
    void save(List<Row> rows);
}

class ImportJob {
    private final RowReader reader;
    private final RowStore store;

    ImportJob(RowReader reader, RowStore store) {
        this.reader = reader;
        this.store = store;
    }

    void run() {
        store.save(reader.read());
    }
}
```

`ImportJob` still defines the import workflow. It no longer decides how reading and storing are implemented.

## IoC and Dependency Injection

Dependency Injection is one way to apply Inversion of Control. Instead of a class constructing its dependencies, another object provides them.

```java
ImportJob job = new ImportJob(new CsvReader("input.csv"), new SqlRowStore(dataSource));
job.run();
```

The class receives what it needs. The code that wires the object graph owns construction policy.

## IoC and Service Locator

Service Locator also inverts lookup, but the dependent class asks a registry for what it needs.

```dart
class ImportJob {
  ImportJob(this.locator);

  final ServiceLocator locator;

  Future<void> run() async {
    final reader = locator.get<RowReader>();
    final store = locator.get<RowStore>();
    await store.save(await reader.read());
  }
}
```

This can be practical, but it hides dependencies inside method bodies. Constructor
injection usually makes required collaborators easier to see, test, and refactor.

## When It Helps

IoC helps when code needs to vary behavior without rewriting the core workflow:

- UI frameworks calling application callbacks.
- Test code replacing network or database collaborators.
- Application startup deciding which implementations to use.
- Plugins adding behavior through interfaces.

The cost is indirection. If there is only one implementation and no meaningful boundary, direct construction may be clearer.

## References

- [Inversion of Control Containers and the Dependency Injection pattern](https://martinfowler.com/articles/injection.html)
- [Composition Root](https://blog.ploeh.dk/2011/07/28/CompositionRoot/)
