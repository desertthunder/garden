---
title: Subdirectory to Submodule
---

> Goal: Split a subfolder (e.g. a Python package) from an existing (Go) project into a standalone repository with a fully preserved commit history.

This documents how I split [ytx](https://github.com/desertthunder/ytx) into a separate fastapi [project](https://github.com/desertthunder/ytm).

## Prerequisites

Install [`git-filter-repo`](https://github.com/newren/git-filter-repo):

```bash
brew install git-filter-repo   # macOS or
pip install git-filter-repo    # cross-platform
```

## Steps

### Clone the Original

```bash
git clone https://github.com/desertthunder/ytx.git
cd ytm
```

### Filter the history to only include the subdirectory

```bash
git filter-repo --path music --force
git mv music/**/* ./
git commit -m "unwrap repo"
```

> This rewrites history so only commits touching that folder remain.

### Push

```bash
git remote add origin git@github.com:desertthunder/ytm.git
git push -u origin main
```

## Linking Back

In the original project:

```bash
cd ytx # clone ytx
git rm -r --cached music
rm -rf music
git submodule add git@github.com:desertthunder/ytm.git music
git commit -m "Add Python package as submodule"
```
