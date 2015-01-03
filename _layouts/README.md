_layouts
========

Switch to *gh-pages* branch


```bash
$ git checkout gh-pages
```

Add *_config.yml*

```yaml

```

Ignore *_config.yml*


```bash
$ echo _config.yml >> .gitignore
```

Add subtree repo

```bash
$ git remote add _layouts https://github.com/fibo/_layouts
$ git subtree add --prefix=_layouts _layouts master
```

