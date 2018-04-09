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

The image below is an SVG generated server side by [flow-view Canvas](#canvas): click it to
see [online example][online_example].

[![sample view][sample_view_svg]{:.responsive}][online_example]

The following animated gif represents a family tree.
You can use autocompletion thanks to `nodeList` option parameter.

![The Simpsons][simpsons_gif]

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

Create an empty canvas, with default options.

```javascript
const canvas = new Canvas(container)
```

### `canvas.load(view: FlowView): FlowViewCanvas`

> Load a view, that is a collection of nodes and links.

* **@param** `{Object}` **[view]** can be empty
* **@param** `{Number}` **[view.height]** defaults to container height
* **@param** `{Number}` **[view.width]** defaults to container width
* **@param** `{Object}` **view.link**, see [link spec](#link-spec) below
* **@param** `{Object}` **view.node**, see [node spec](#node-spec) below
* **@returns** `{Object}` flowViewCanvas

For example:

```javascript
const view = {
  nodes: [
    {
      id: 'a',
      x: 80,
      y: 100,
      text: 'Drag me',
      outs: [
        { name: 'out1' },
        { name: 'out2' },
        { name: 'out3' }
      ]
    },
    {
      id: 'b',
      x: 180,
      y: 200,
      text: 'Click me',
      ins: [
        { name: 'in0' },
        { name: 'in1', type: 'bool' }
      ],
      outs: [
        { name: 'return' }
      ]
    }
  ],
  links: [
    {
      id: 'c',
      from: ['a', 0],
      to: ['b', 1]
    }
  ]
}

canvas.load(view)
```

### `canvas.mountOn(container: Element): void`

> Mount canvas on a DOM element and render its view, that is a collection of nodes and links.

* **@param** `{HTMLElement}` **container** DOM element
* **@returns** `{void}`

For example:

```javascript
canvas.mountOn(document.getElementById('drawing'))
```

### `canvas.resize({ width: number, height: number }): void`

### Events

Class `FlowViewCanvas` inherits from [EventEmitter], it is possible to listen to events like in the following snippet.

```javascript
dextop.on('move', ({ x, y }) => {
  console.log('updated position', x, y)
})
```

The following events are emitted:

The following events are emitted by [canvas](#canvas):

| name                  | data                          |
|-----------------------|-------------------------------|
| `createInputPin`      | { nodeId, position, pin }     |
| `createLink`          | link                          |
| `createNode`          | node                          |
| `createOutputPin`     | { nodeId, position, pin }     |
| `deleteLink`          | link                          |
| `deleteNode`          | node                          |
| `deleteInputPin`      | { nodeId, position }          |
| `deleteOutputPin`     | { nodeId, position }          |
| `updateNodesGeometry` | [ nodes ]                     |

See [event/emitter.js][example_event_emitter] example.

### Hotkeys

Few hotkyes are defined.

Arrows <kbd>↑</kbd> <kbd>→</kbd> <kbd>↓</kbd> <kbd>←</kbd> translate currently selected nodes, if also <kbd>SHIFT</kbd> is pressed translation is performed pixel by pixel.
<kbd>ESC</kbd> cancel current selection.
Keys <kbd>i</kbd> and <kbd>o</kbd> create respectively input and output pins from current selected node. If also <kbd>SHIFT</kbd> is pressed, pins are deleted.

### Node spec

A node describes an element and has the following attributes:

* **@param** `Number` **x** coordinate of top left vertex
* **@param** `Number` **y** coordinate of top left vertex
* **@param** `String` **text**
* **@param** `Array | undefined` **ins** is a list of input pins
* **@param** `Array | undefined` **outs** is a list of output pins
* **@param** `Number` **[width]**, defaults to a value depending on text lenght and number of pins.

An pin is an object with the `name` attribute which must be a string.
Input pins default to `{ name: in${position} }`.
Output pins default to `{ name: out${position} }`.
If *ins* is undefined, the node is a root.
If *outs* is undefined, the node is a leaf.

### Link spec

A link describes a connection between elements and has the following attributes:

* **@param** `Array` **from** has exactly two elements
* **@param** `String` **from[0]** is the key of the source node
* **@param** `Number` **from[1]** is the output pin position
* **@param** `Array` **to** has exactly two elements
* **@param** `String` **to[0]** is the key of the target node
* **@param** `Number` **to[1]** is the input pin position

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
* [dom/element.js][example_dom_element]: `npm run example_dom_element`
* [event/emitter.js][example_event_emitter]: `npm run example_event_emitter`
* [empty/canvas.js][example_empty_canvas]: `npm run example_empty_canvas`
* [genealogic/tree.js][example_genealogic_tree]: `npm run example_genealogic_tree`
* [theme/dark.js][example_theme_dark]: `npm run example_theme_dark`

Note that examples are intended to be used for development, hence there
is an overhead at start time.
For instance: client side examples use hot reload, and are transpiled on the fly; also server side example will launch babel before starting.

## License

[MIT](http://g14n.info/mit-license)

[dflow]: http://g14n.info/dflow "dflow"
[dataflow_wikipedia]: https://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
[EventEmitter]: https://www.npmjs.com/package/events "EventEmitter"
[example_basic_usage]: https://github.com/fibo/flow-view/blob/master/examples/basic/usage.js
[example_dom_element]: https://github.com/fibo/flow-view/blob/master/examples/dom/element.js
[example_empty_canvas]: https://github.com/fibo/flow-view/blob/master/examples/empty/canvas.js
[example_event_emitter]: https://github.com/fibo/flow-view/blob/master/examples/event/emitter.js
[example_genealogic_tree]: https://github.com/fibo/flow-view/blob/master/examples/genealogic/tree.js
[example_theme_dark]: https://github.com/fibo/flow-view/blob/master/examples/theme/dark.js
[online_example]: http://g14n.info/flow-view/example "Online example"
[sample_view_svg]: https://g14n.info/flow-view/svg/sample-view.svg "SVG Sample"
[simpsons_gif]: https://g14n.info/flow-view/media/TheSimspons.gif "The Simpsons Family"
