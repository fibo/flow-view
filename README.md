_includes
=========

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
$ git remote add _includes https://github.com/fibo/_includes
$ git subtree add --prefix=_includes _includes master
```

