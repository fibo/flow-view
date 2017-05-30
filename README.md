# g14n.info-jekyll-includes

> is a git subtree containing Jekyll includes used across my personal website

## Setup

Assuming that you are using the *docs/* folder for GitHub Pages, do

1. [Add remote](#add-remote)
2. [Add subtree](#add-subtree)

Then use the includes as usual, for example in *docs/_layouts/page.html*

```
{% include common/analytics.html %}
```

### Add remote

```bash
git remote add common_includes git@github.com:fibo/g14n.info-jekyll-includes.git
```

### Add subtree

```bash
git subtree add --prefix=docs/_includes/common/ common_includes master
```

## Update

If you are in a new cloned repo, you need to [add remote](#add-remote) first.

In a working tree with all modifications committed, launch

```
git subtree --prefix=docs/_includes/common/ pull common_includes master
```

## Content

### analytics.html

Contains Google Analytics tag.

### footer.html

Copyright, license.

### meta.html

Requires `page.title` and *_data/package.json* file with the following entries:

* description
* keywords
* author.name

### nav.html

Implments nav bar, requires `page.nav` or `site.nav` variable like

```yaml
nav:
  Pizza: /pizza
  Mafia: '#mafia'
  Mandolino: //g14n.info
```

### js-bundle.html

Includes `g14n.info/js/bundle.js` that implements common features across
website, like nav toggle.

### style.html

Adds common style sheet.

### github-corner.html

**DEPRECATED**

Comes from [GitHub corners](http://tholman.com/github-corners/).

### github-markdown-css.html

**DEPRECATED**

[github-markdown-css](https://github.com/sindresorhus/github-markdown-css) is

> The minimal amount of CSS to replicate the GitHub Markdown style

