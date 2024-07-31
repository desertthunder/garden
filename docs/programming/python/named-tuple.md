---
title: Named Tuple
---

The purpose of a named tuple is to create lightweight object types with named
properties. A cartesian coordinate/point is the most common example used.

```python
from typing import NamedTuple

class Point(NamedTuple):
 """A point in a 2D space representing a cartesian coordinate."""

    x: float
    y: float

    def __str__(self):
        return f"({self.x}, {self.y})"
```

> Python’s namedtuple() is a factory function available in collections. It allows you to create tuple subclasses with named fields.
>
> You can access the values in a given named tuple using the dot notation and the field names, like in obj.attr.[^1]

[^1]: Python, Real. Write Pythonic and Clean Code With Namedtuple – Real Python. <https://realpython.com/python-namedtuple/>. Accessed 7 June 2024.
