---
title: Command Pattern
---

Notes from *Game Programming Patterns*[^1]

> Encapsulate a request as an object, thereby letting users parameterize clients with different requests,
> queue or log requests, and support undoable operations.[^2]

Robert Nystrom’s simpler definition:

> A command is a reified method call.
> ("Reify" = make something real or tangible - i.e., turn an action into an object.)

- Instead of *calling a method directly*, wrap the call in an **object**.
- The object can be **stored**, **passed around**, **queued**, **serialized**, or **executed later**.
- Functionally similar to a **callback**, **closure**, or **first-class function**, but in an OOP form.

## Configurable Input

A hardcoded input system like below is **rigid** because actions are hard-wired.

```cpp
if (isPressed(BUTTON_X)) jump();
else if (isPressed(BUTTON_Y)) fireGun();
```

### Solution

Create a **Command** base class:

```cpp
class Command {
public:
  virtual ~Command() {}
  virtual void execute() = 0;
};
```

Then derive specific commands:

```cpp
class JumpCommand : public Command {
    void execute() override { jump(); }
};
```

Each button maps to a `Command*`:

```cpp
Command* buttonX_;
Command* buttonY_;
```

Now you can **bind** any button to any action and even swap them at runtime.

## Directions for Actors

Earlier commands assume a global player object. We want to **decouple** the command from who performs it.

### Solution

Pass an actor reference into `execute()`:

```cpp
class Command {
    public:
        virtual void execute(GameActor& actor) = 0;
};
```

Example:

```cpp
class JumpCommand : public Command {
    void execute(GameActor& actor) override { actor.jump(); }
};
```

- Works for any actor (player, AI, NPC).
- Input handler or AI module becomes **producer** of commands.
- The actor or dispatcher becomes the **consumer**.
- Enables:
  - Player <-> AI control switching.
  - Queuing or networking commands (e.g., multiplayer replay).

## Undo / Redo

Each command can **reverse** its own effect.

```cpp
class Command {
    public:
        virtual void execute() = 0;
        virtual void undo() = 0;
};
```

- Maintain a **history stack** of commands.
- Undo = call `undo()` and move cursor back.
- Redo = advance cursor and `execute()` again.
- Common in:
  - Strategy games (rollback)
  - Editors / tools
  - Replay systems (record commands instead of state snapshots)

### Example

```cpp
class MoveUnitCommand : public Command {
    Unit* unit_;
    int xBefore_, yBefore_, x_, y_;

public:
    MoveUnitCommand(Unit* unit, int x, int y) : unit_(unit), x_(x), y_(y) {}

    void execute() override {
        xBefore_ = unit_->x();
        yBefore_ = unit_->y();
        unit_->moveTo(x_, y_);
    }

    void undo() override {
    unit_->moveTo(xBefore_, yBefore_);
    }
};
```

## Functional vs Class-based

### In C++

- Commands are classes (limited first-class function support).

### In JS / Functional languages

Use **closures**:

```js
function makeMoveCommand(unit, x, y) {
  let xBefore, yBefore;
  return {
    execute() {
      xBefore = unit.x();
      yBefore = unit.y();
      unit.moveTo(x, y);
    },
    undo() {
      unit.moveTo(xBefore, yBefore);
    }
  };
}
```

The Command pattern is effectively a way to **simulate closures** in OOP languages.

## Related Patterns

| Pattern                        | Relation                                     |
| ------------------------------ | -------------------------------------------- |
| **Null Object**                | Define a no-op Command to avoid null checks. |
| **Event Queue**                | Commands can be queued and processed later.  |
| **Memento**                    | Alternative undo strategy (state snapshot).  |
| **Persistent Data Structures** | Enable cheap undo by sharing structure.      |
| **Subclass Sandbox**           | Define base command helpers for easy reuse.  |
| **Chain of Responsibility**    | Route commands through object hierarchies.   |
| **Flyweight**                  | Share stateless command instances.           |
| **Singleton (anti-pattern)**   | Don’t use - unnecessary here.                |

## Summary

| Concept                | Description                       | Example                          |
| ---------------------- | --------------------------------- | -------------------------------- |
| **Reified Call**       | Treat an action as data           | `Command` object                 |
| **Decoupling**         | Separate input/AI from execution  | `InputHandler → Command → Actor` |
| **Undo/Redo**          | Store inverse operations          | `execute()` + `undo()`           |
| **Serialization**      | Send command streams over network | Multiplayer replay               |
| **Functional Variant** | Closure-based commands            | JS functions                     |
| **Common Pitfall**     | Forgetting to track old state     | `xBefore`, `yBefore`             |

The **Command Pattern** is for turning behavior into manipulable data. It’s invaluable for:

- Input handling
- Undo/redo systems
- AI action control
- Replay and networking
- Modular, decoupled architecture

[^1]: Command · Design Patterns Revisited · Game Programming Patterns. <https://gameprogrammingpatterns.com/command.html>. Accessed 21 Oct. 2025.
[^2]: Gamma, Erich, editor. Design Patterns: Elements of Reusable Object-Oriented Software. 39. printing, Addison-Wesley, 2011. Addison-Wesley Professional Computing Series.
