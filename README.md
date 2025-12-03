# flow-view

> Visual editor for [Dataflow programming](https://en.wikipedia.org/wiki/Dataflow_programming)

<a href="https://fibo.github.io/flow-view/">
  <div>Demo</div>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://fibo.github.io/flow-view/assets/screenshot-dark.png">
    <img width="350" src="https://fibo.github.io/flow-view/assets/screenshot-light.png" alt="The Simpsons flow-view example">
  </picture>
</a>

## Installation

### Using npm

With [npm](https://npmjs.org/) do

```shell
npm install flow-view
```

### Using a CDN

Try this in your HTML page

```html
<script type="importmap">
  { "imports": { "flow-view": "https://unpkg.com/flow-view" } }
</script>

<style>
  .container {
    max-width: 100%;
    height: 400px;
  }
</style>

<div class="container"></div>

<script type="module">
  import { FlowView } from 'flow-view';

  const container = document.querySelector('.container');
  const flowView = FlowView.instance(container);
  flowView.load({
    nodes: {
      id1: { text: 'Hello World', x: 10, y: 10 }
    }
  });
</script>
```

> [!WARNING]
> Be aware that there is no minified bundle, so you probably do not want to use the CDN in production.
> Your bundler (e.g. esbuild, Vite, rollup, etc.) will take care of minification and transpiling according to your target browsers.

## Usage

See [documentation and examples](http://fibo.github.io/flow-view/).

## License

[MIT](http://fibo.github.io/mit-license)

