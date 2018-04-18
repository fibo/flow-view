# flow-view

> is a visual editor for [Dataflow programming][dataflow_wikipedia]

[Installation](#installation) |
[API](#api) |
[Examples](#examples) |
[License](#license)

[![Whatchers](http://g14n.info/svg/github/watchers/flow-view.svg)](https://github.com/fibo/flow-view/watchers) [![Stargazers](http://g14n.info/svg/github/stars/flow-view.svg)](https://github.com/fibo/flow-view/stargazers) [![Forks](http://g14n.info/svg/github/forks/flow-view.svg)](https://github.com/fibo/flow-view/network/members)

[![NPM version](https://badge.fury.io/js/flow-view.svg)](http://badge.fury.io/js/flow-view)
[![Build Status](https://travis-ci.org/fibo/flow-view.svg?branch=master)](https://travis-ci.org/fibo/flow-view?branch=master)
[![Dependency Status](https://david-dm.org/fibo/flow-view.svg)](https://david-dm.org/fibo/flow-view)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Change log](https://img.shields.io/badge/change-log-blue.svg)](http://g14n.info/flow-view/changelog)

<p><a href="http://codepen.io/fibo/pen/qNNmdd/"><img src="http://blog.codepen.io/wp-content/uploads/2012/06/TryItOn-CodePen.svg" style="width: 10em; height: auto;" /></a></p>

## Installation

### Using npm

With [npm](https://npmjs.org/) do

```bash
npm install flow-view
```

### Using a CDN

Adding this to your HTML page

```html
<script src="https://unpkg.com/flow-view/dist/flow-view.min.js"></script>
```

## API

### Canvas

To import *flow-view* Canvas choose your favourite syntax among:

* `const Canvas = require('flow-view').Canvas`
* `import { FlowViewCanvas } from 'flow-view'`

Suppose your *container* is a div with id `drawing`.
In your HTML, place a div where you want to mount the canvas.

```html
<style>
  #drawing {
    width: 100%;
    height: 100vh;
  }
</style>
<div id="drawing"></div>
```

Create an empty canvas.

```javascript
const container = document.getElementById('drawing')

const canvas = new Canvas(container)
```

## Examples

Try [online example][online_example].

You can also clone this repo and install dependencies to run examples locally

```bash
git clone https://github.com/fibo/flow-view
cd flow-view
npm install
```

Every example has its homonym npm script, for example [basic/usage.js][example_basic_usage] example is launched by command

```bash
npm run example_basic_usage
```

Available examples are:

* [basic/usage.js][example_basic_usage]: `npm run example_basic_usage`
* [empty/canvas.js][example_empty_canvas]: `npm run example_empty_canvas`
* [genealogic/tree.js][example_genealogic_tree]: `npm run example_genealogic_tree`

## License

[MIT](http://g14n.info/mit-license)

[dflow]: http://g14n.info/dflow "dflow"
[dataflow_wikipedia]: https://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
[example_basic_usage]: https://github.com/fibo/flow-view/blob/master/examples/basic/usage.js
[example_empty_canvas]: https://github.com/fibo/flow-view/blob/master/examples/empty/canvas.js
[example_genealogic_tree]: https://github.com/fibo/flow-view/blob/master/examples/genealogic/tree.js
[online_example]: http://g14n.info/flow-view/example "Online example"
[sample_view_svg]: https://g14n.info/flow-view/svg/sample-view.svg "SVG Sample"
[simpsons_gif]: https://g14n.info/flow-view/media/TheSimspons.gif "The Simpsons Family"
