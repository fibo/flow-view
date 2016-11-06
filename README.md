# g14n.info-jekyll-layouts

> is a git subtree containing Jekyll layouts used across my personal website

## Microsite

By **microsite** I mean a subset of a website. For example `http://example.org/my-microsite`.

The following g14n.info microsites are involved:

<!--
* [algebra](http://g14n.info/algebra)
* [dflow](http://g14n.info/dflow)
* [flow-view](http://g14n.info/flow-view)
* [geohash-neighbours](http://g14n.info/geohash-neighbours)
* [iper](http://g14n.info/iper)
-->
* [tris3d-canvas](http://g14n.info/tris3d-canvas)
* [Sul-problema-di-Apollonio](http://g14n.info/Sul-problema-di-Apollonio)

## Setup

First of all, make sure you have already imported [g14n.info-jekyll-includes].

Assuming that the content of the *gh-pages* branch is under the *gh-pages/* folder, do

1. [Add remote](#add-remote)
2. [Add subtree](#add-subtree)

Then you can use the layouts contained in this repo, by prexifing it with
*common/* folder, for example

```yaml
---
title: Home Page
layout: common/page
---
```

### Add remote

```bash
git remote add common_layouts git@github.com:fibo/g14n.info-jekyll-layouts.git
```

### Add subtree

```bash
git subtree add --prefix=gh-pages/_layouts/common/ common_layouts master
```

## Update

If you are in a new cloned repo, you need to [add remote](#add-remote) first.

In a working tree with all modifications committed, launch

```bash
git subtree --prefix=gh-pages/_layouts/common/ pull common_layouts master
```

## Content

### singlepage

Use it for a single page [microsite]. See [example page](http://g14n.info/example-layout/singlepage/).

Requires

* Exists resource `//style.css`.
* Variables `page.title`, `page.keywords` and `page.description`.

Follows a sample YAML frontmatter

```yaml
title: My title
description: example
keywords:
  - pizza
  - mafia
```

### responsive-side-menu.html

Requires

* variable `site.domain`.
* file *_data/package.json* containing attribute *name*.
* file *_data/menu.yml* containing menu entries and their href.

Follows a sample *menu.yml*

```yaml
Example: example
API: '#api'
```

[microsite](#microsite)
[g14n.info-jekyll-includes]: https://github.com/fibo/g14n.info-jekyll-includes "g14n.info-jekyll-includes"
