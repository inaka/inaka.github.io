# inaka.github.io

## Overview
Inaka's Open Source Projects List. This repo is used to build and display [inaka.github.io](http://inaka.github.io) based on our ever-growing list of open-source repos hosted on github.

## Updating the Website

### Package List

To update the package list, run

```bash
$ ./update
```

You need Erlang installed.

### Website in General

To update the HTML/CSS for the website, run

```bash
$ jade web -out new_web/
```

Then switch to `master` branch and apply the changes in the htmls that are now in `new_web/` to the ones in the root folder.
