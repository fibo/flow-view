# flow-view

> Visual editor for [Dataflow programming][dataflow_wikipedia]

<a href="https://fibo.github.io/flow-view/">
<div>Demo</div>
<img width="350" height="350" src="https://fibo.github.io/flow-view/assets/screenshot.png" alt="The Simpsons flow-view example">
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
    "nodes": {
      id1: { "type": "Hello", "x": 10, "y": 10 }
    }
  });
</script>
```

Be aware that there is no minified bundle, so you probably do not want to use the CDN in production.

## Usage

See [documentation and examples page](http://fibo.github.io/flow-view/).

## License

[MIT](http://fibo.github.io/mit-license)

[dataflow_wikipedia]: https://en.wikipedia.org/wiki/Dataflow_programming 'Dataflow programming'
