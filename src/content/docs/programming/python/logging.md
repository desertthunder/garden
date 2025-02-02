---
title: Logging
---

## Overview

Anyone who’s ever worked on a large production project with intense demands understands
the importance of using the different log levels appropriately, creating module-specific
loggers, meticulously logging information about important events, and including extra
detail about the application’s state when those events are logged.

- Logs[^1] help when standard debugging tools are not enough.
- Levels
  - CRITICAL
    - Requires urgent attention (your app can't run without this addressed)
  - ERROR
    - Uncaught exceptions
    - When `DEBUG` is `False`, Django emails admins so consider logging only whatever
    is worth emailing to you or your administrators
  - WARNING
    - Good for logging events that are unusual and potentially bad, but not as
    bad as ERROR-level events.
  - INFO
    - Application state
  - DEBUG
    - Wherever a `print` might go
- `Logger,exception` includes tracebacks. For additional info, use the `exc_info`
  kwarg
- One logger per module!

```python
# You can place this snippet at the top
# of models.py, views.py, or any other
# file where you need to log.
import logging

logger = logging.getLogger(__name__)
```

[^1]: Greenfeld, Daniel, and Audrey Roy.
Two Scoops of Django 1.11: Best Practices for Django Web Framework.
Los Angeles, California, Two Scoops Press, 2017.
