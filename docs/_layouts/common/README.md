# g14n.info-jekyll-layouts

> is a git subtree containing Jekyll layouts used across my personal website

## Microsite

By **microsite** I mean a subset of a website. For example `http://example.org/my-microsite`.

## Setup

First of all, make sure you have already imported [g14n.info-jekyll-includes].

Assuming that you are using the *docs/* folder for GitHub Pages, do

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
git subtree add --prefix=docs/_layouts/common/ common_layouts master
```

## Update

If you are in a new cloned repo, you need to [add remote](#add-remote) first.

In a working tree with all modifications committed, launch

```bash
git subtree --prefix=docs/_layouts/common/ pull common_layouts master
```

## Content

### page

Use it for every [microsite](#microsite) basic page. See [example page][page_template].

Requires the following.

* Variable `page.title`, or `site.data.package.name`
* List of `keywords` in `page` or `site.data.package`.
* Variable `description` in `page` or `site.data.package`.
* Optional variable `site.lang`, defaults to *en*.
* A `nav` hash with menu items. If `page.nav` is not found, it will look for `site.nav`.

Follows a sample YAML frontmatter

```yaml
title: My title
description: example
keywords:
  - pizza
  - mafia
nav:
  Pizza: /pizza
  Mafia: '#mafia'
  Mandolino: //g14n.info
```

[page_template]: http://g14n.info/templates/page "page template"
[g14n.info-jekyll-includes]: https://github.com/fibo/g14n.info-jekyll-includes "g14n.info-jekyll-includes"
