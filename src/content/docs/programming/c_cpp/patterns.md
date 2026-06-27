---
title: C/C++ Patterns
tags:
  - c-cpp
  - programming
  - systems-programming
---

Source: <https://cs61.seas.harvard.edu/site/2025/Patterns/>

## Silence Intentional Unused Variables

Compile warning-free, but make intentional omissions explicit.

```cpp
void* m61_malloc(size_t sz, const char* file, int line) {
    (void) file, (void) line; // silence warnings
    return malloc(sz);
}
```

Use this when a parameter will be used later, or is required by an interface but
not used by this implementation. The `(void)` cast says:
“I know this value is unused.”

For unused static functions in modern C++:

```cpp
[[maybe_unused]] static void helper() {
}
```

## Sized Integer Types

Include:

```cpp
#include <cstdint>
```

Common choices:

- `uint8_t`, `int8_t`: exactly 8 bits.
- `uint16_t`, `int16_t`: exactly 16 bits.
- `uint32_t`, `int32_t`: exactly 32 bits.
- `uint64_t`, `int64_t`: exactly 64 bits.
- `uintptr_t`, `intptr_t`: integer type the same size as a pointer.
- `size_t`: unsigned type for object sizes; returned by `sizeof`.
- `ssize_t`: signed counterpart with the same width as `size_t`.
- `ptrdiff_t`: type of pointer subtraction, as in `p2 - p1`.
- `off_t`: file sizes and file offsets; can be larger than memory-sized types.

Rule of thumb: choose a type that matches the domain. Use `size_t` for memory
object sizes, `ptrdiff_t` for pointer differences, fixed-width types when the
bit width matters, and `uintptr_t` only when you really need pointer-sized
integer behavior.

## Linked List Basics

Terminology:

- `node`: one item in the list.
- `head`: first node, or `nullptr` when empty.
- `tail`: last node, or `nullptr` when empty.
- `next`: moves head-to-tail.
- `prev`: moves tail-to-head.
- `trav`: conventional traversal variable name.

Linked lists support O(1) insertion/deletion when you already have the relevant
node, but search is usually O(N).

### Doubly Linked List With Head

Supports O(1):

- push front
- erase known node

```cpp
struct node {
    node* next;
    node* prev;
};

struct list {
    node* head = nullptr;
};

void list_push_front(list* l, node* n) {
    n->next = l->head;
    n->prev = nullptr;
    if (l->head) {
        l->head->prev = n;
    }
    l->head = n;
}

void list_erase(list* l, node* n) {
    if (n->next) {
        n->next->prev = n->prev;
    }
    if (n->prev) {
        n->prev->next = n->next;
    } else {
        l->head = n->next;
    }
}
```

Key edge case: erasing the head needs `l->head = n->next`.

### Doubly Linked List With Head And Tail

Supports O(1):

- push front
- push back
- erase known node

```cpp
struct list {
    node* head = nullptr;
    node* tail = nullptr;
};

void list_push_front(list* l, node* n) {
    n->next = l->head;
    n->prev = nullptr;
    if (l->head) {
        l->head->prev = n;
    } else {
        l->tail = n;
    }
    l->head = n;
}

void list_push_back(list* l, node* n) {
    n->next = nullptr;
    n->prev = l->tail;
    if (l->tail) {
        l->tail->next = n;
    } else {
        l->head = n;
    }
    l->tail = n;
}

void list_erase(list* l, node* n) {
    if (n->next) {
        n->next->prev = n->prev;
    } else {
        l->tail = n->prev;
    }
    if (n->prev) {
        n->prev->next = n->next;
    } else {
        l->head = n->next;
    }
}
```

Extra invariant: if the list has one node, that node is both `head` and `tail`.
Every insertion and deletion must preserve this.

## Erasing While Iterating

Problem: erasing an element invalidates the iterator pointing to it.

Pattern:

- If you keep the element, increment the iterator.
- If you erase the element, assign the iterator returned by `erase`.

```cpp
void remove_even_items(std::map<std::string, int>& map) {
    for (auto it = map.begin(); it != map.end(); ) {
        if (it->second % 2 == 0) {
            it = map.erase(it);
        } else {
            ++it;
        }
    }
}
```

Do not write `++it` after `erase(it)` unless the API specifically says that
remains valid.

## Growable Arrays: Size And Capacity

Maintain:

- `size`: number of initialized elements.
- `capacity`: number of allocated slots.

Invariant:

```text
size <= capacity
```

Push-back rule:

1. If `size < capacity`, store the new element.
2. If `size == capacity`, grow first.
3. Growth strategy: double capacity, with a small initial capacity such as 8.

```cpp
struct vector_of_T {
    T* data = nullptr;
    size_t size = 0;
    size_t capacity = 0;
};

T* vector_get(vector_of_T* v, size_t i) {
    assert(i < v->size);
    return &v->data[i];
}

void vector_push_back(vector_of_T* v, T new_element) {
    if (v->size == v->capacity) {
        size_t new_capacity = v->capacity ? v->capacity * 2 : 8;
        v->data = (T*) realloc(v->data, sizeof(T) * new_capacity);
        v->capacity = new_capacity;
    }

    v->data[v->size] = new_element;
    ++v->size;
}
```

Why doubling matters: growing by a fixed amount causes too many reallocations
and copies. Doubling makes allocation overhead logarithmic in the maximum size reached.

In normal C++, prefer `std::vector<T>`. Learn this pattern to understand why
`std::vector` is efficient and how capacity-based growth works.
