# API Testing In Bash

## Pipe Operator

The pipe operator (`|`) connects the STDOUT (standard output) file descriptor
of the first process to the STDIN (standard input) of the second. What happens
then is that when the first process writes to its STDOUT, that output can be
immediately read (from STDIN) by the second process.

## jq

To access a key in a JSON object, use the following syntax:

```bash
jq '.key'

# Or with a json array
jq '.array[0]'
```

## cURL

To make a request to an API, use the following syntax:

The `-s` flag is used to suppress the progress bar and other unnecessary

information.

```bash
curl -s https://statsapi.mlb.com/api/v1/teams
```

Adding params & piping to `jq` for pretty printing:

```bash
curl -s https://statsapi.mlb.com/api/v1/teams?sportId=1 | jq '.teams[0]'
```
