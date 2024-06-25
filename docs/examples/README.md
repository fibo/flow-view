# Flow View examples

Every HTML file in this folder can be loaded into the [documentation homepage](../../index.html) via a custom click event on anchors.
Notice that every HTML file has an `article` tag as root element.

JavaScript files are referenced as `data-script` attribute on anchors. For example:

```html
<a href="./docs/examples/foo.html" data-script="./docs/examples/foo.js"
  >Foo example</a
>
```
