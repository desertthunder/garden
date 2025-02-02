---
title: HTTP Requests in Golang
---

Use the ioutil.ReadAll function to read the HTTP response’s Body.

The Body is an io.ReadCloser value, a combination of io.Reader and io.Closer,
which means you can read the body’s data using anything that can read from an
io.Reader value.[^1]

Note that while this is still a valid way to read the body of an HTTP response,
the ioutil package has been deprecated in Go 1.16. You can still use it, but
the godoc will tell you to just call `io.ReadAll` directly.

## Example

```go
package main

import (
    "fmt"
    "io"
    "net/http"
)

func main() {
    resp, err := http.Get("https://pokeapi.co/api/v2/pokemon/681")

    if err != nil {
        fmt.Println("Error: ", err)
        return
    }

    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)

    if err != nil {
        fmt.Println("Error: ", err)

        return
    }

    fmt.Println(string(body))
}
```

[^1]: Kristin Davidson and Rachel Lee. How To Make HTTP Requests in Go |
DigitalOcean.
<https://www.digitalocean.com/community/tutorials/how-to-make-http-requests-in-go>.
Accessed 11 May 2024.
