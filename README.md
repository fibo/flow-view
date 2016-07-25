# g14n.info-jekyll-includes

> is a git subtree containing Jekyll includes used across my personal website

The following g14n.info microsites are involved:

* [algebra](http://g14n.info/algebra)
* [dflow](http://g14n.info/dflow)
* [flow-view](http://g14n.info/flow-view)
* [geohash-neighbours](http://g14n.info/geohash-neighbours)
* [iper](http://g14n.info/iper)
* [tris3d-canvas](http://g14n.info/tris3d-canvas)

## Setup

Assuming that the content of the *gh-pages* branch is under the *gh-pages/* folder, do

1. [Add remote](#add-remote)
2. [Add subtree](#add-subtree)

Then use the includes as usual, for example in *gh-pages/_layouts/page.html*

```
{% include common/analytics.html %}
```

### Add remote

```
git remote add common_includes git@github.com:fibo/g14n.info-jekyll-includes.git
```

### Add subtree

```
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

Add to your *_config.yml*

```
google-analytics:
  id: UA-12635045-12
```

### meta.html

Requires `page.title` and *_data/package.json* file with the following entries:

* description
* keywords
* author.name

### purecss.html

Includes a minified version of purecss from Yahoo CDN.

