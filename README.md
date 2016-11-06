# g14n.info-jekyll-includes

> is a git subtree containing Jekyll includes used across my personal website

## Setup

Assuming that the content of the *gh-pages* branch is under the *gh-pages/* folder, do

1. [Add remote](#add-remote)
2. [Add subtree](#add-subtree)

Then use the includes as usual, for example in *gh-pages/_layouts/page.html*

```
{% include common/analytics.html %}
```

### Add remote

```bash
git remote add common_includes git@github.com:fibo/g14n.info-jekyll-includes.git
```

### Add subtree

```bash
git subtree add --prefix=gh-pages/_includes/common/ common_includes master
```

## Update

If you are in a new cloned repo, you need to [add remote](#add-remote) first.

In a working tree with all modifications committed, launch

```
git subtree --prefix=gh-pages/_includes/common/ pull common_includes master
```

## Content

### analytics.html

### meta.html

Requires `page.title` and *_data/package.json* file with the following entries:

* description
* keywords
* author.name

### purecss.html

Includes a minified version of purecss from Yahoo CDN.

### github-corner.html

Comes from [GitHub corners](http://tholman.com/github-corners/).

### github-markdown-css.html

[github-markdown-css](https://github.com/sindresorhus/github-markdown-css) is

> The minimal amount of CSS to replicate the GitHub Markdown style

