# g14n.info-jekyll-includes

> is a git subtree containing Jekyll includes used across my personal website

The following g14n.info microsites are involved:

* [algebra](http://g14n.info/algebra)
* [dflow](http://g14n.info/dflow)
* [flow-view](http://g14n.info/flow-view)

## Setup

Assuming that the content of the *gh-pages* branch is under the *gh-pages/* folder,

```
git remote add common_includes git@github.com:fibo/g14n.info-jekyll-includes.git
git subtree add --prefix=gh-pages/_includes/common/ common_includes master
```

The use the includes as usual, for example in *gh-pages/_layouts/page.html*

```
{% include common/analytics.html %}
```

## Update

In a working tree with all modifications committed, launch

```
git subtree --prefix=gh-pages/_includes/common/ pull common_includes master
```
