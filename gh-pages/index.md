---
title: flow-view
flow: /empty.json
---
# flow-view

> is a visual editor for [Dataflow programming][dataflow_wikipedia], powered by [React]

The image below is an SVG generated server side by [flow-view Canvas](#canvas): click it to
see [online example][online_example].

[![sample view][sample_view_svg]][online_example]

[Description](#description) |
[Installation](#installation) |
[API](#api) |
[Examples](#examples) |
[License](#license)

[![Whatchers](http://g14n.info/svg/github/watchers/flow-view.svg)](https://github.com/fibo/flow-view/watchers) [![Stargazers](http://g14n.info/svg/github/stars/flow-view.svg)](https://github.com/fibo/flow-view/stargazers) [![Forks](http://g14n.info/svg/github/forks/flow-view.svg)](https://github.com/fibo/flow-view/network/members)

[![NPM version](https://badge.fury.io/js/flow-view.svg)](http://badge.fury.io/js/flow-view) [![Build Status](https://travis-ci.org/fibo/flow-view.svg?branch=master)](https://travis-ci.org/fibo/flow-view?branch=master) [![Dependency Status](https://david-dm.org/fibo/flow-view.svg)](https://david-dm.org/fibo/flow-view) [![Change log](https://img.shields.io/badge/change-log-blue.svg)](http://g14n.info/flow-view/changelog)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[![NPM](https://nodei.co/npm-dl/flow-view.png)](https://nodei.co/npm-dl/flow-view/)

<p><a href="http://codepen.io/fibo/pen/qNNmdd/"><img src="http://blog.codepen.io/wp-content/uploads/2012/06/TryItOn-CodePen.svg" style="width: 10em; height: auto;" /></a></p>

## Description

*flow-view* is a reusable visual editor you can use to provide a GUI to your dataflow project.
I am using it for a minimal Dataflow programming engine: [dflow].

The following features are implemented:

* Create nodes and links using a visual interface.
* SVG server side rendering.
* Custom items: nodes, links, inspector can be customized using React.
* Events are emitted to achieve integration with other packages.

> Let's give Node.js a common visual interface. Use *flow-view*!

Any feedback is welcome!

## Installation

With [bower](http://bower.io/) do

```bash
bower install flow-view
```

or use a CDN adding this to your HTML page

```html
<script src="https://cdn.rawgit.com/fibo/flow-view/master/dist/flow-view.min.js"></script>
```

Note that *flow-view* is supposed to be imported in your project build,
so it is recommended you install it with [npm](https://npmjs.org/)

```bash
npm install flow-view
```

## API

<a name="canvas"></a>

### `new Canvas()`

> flow-view Canvas constructor

* **@param** `{String}` containerId
* **@param** `{Object}` [item] collection to be customized
* **@param** `{Object}` [item.inspector]
* **@param** `{Object}` [item.inspector.DefaultInspector]
* **@param** `{Object}` [item.link]
* **@param** `{Object}` [item.link.DefaultLink]
* **@param** `{Object}` [item.node]
* **@param** `{Object}` [item.node.DefaultNode]
* **@param** `{Object}` [item.util]
* **@param** `{Function}` [item.util.typeOfNode]
* **@returns** `{Object}` canvas

Suppose your *containerId* is `drawing`.
In your HTML, **optionally** place a div where you want to mount the canvas.

```html
<div id="drawing"></div>
```

If *flow-view* finds a `document` and does not exist a DOM element
with given *containerId*, a brand new `div` is created and appended
to the page *body*.

Create an empty canvas

```javascript
var Canvas = require('flow-view').Canvas

var canvas = new Canvas('drawing')
```

Note that nothing will happen until you call the [`canvas.render(view)`](#canvasrenderview) method.

### `canvas.container`

It is the DOM element container, if any. On server side, this attribute is `null`.

### `canvas.render()`

Draws a view, that is a collection of nodes and links.
On server side it generates an SVG output like the one you see on top of this README.md,
see [render/serverside.js example][example_render_serverside].

* **@param** `{Object}` *[view]* can be empty
* **@param** `{Number}` *view.height* defaults to container height
* **@param** `{Number}` *view.width* defaults to container width
* **@param** `{Object}` *view.link*, see [link spec](#link-spec) below
* **@param** `{Object}` *view.node*, see [node spec](#node-spec) below
* **@param** `{Object}` *[model]*, can be used for custom items
* **@param** `{Object}` *[callback]* called on serverside context
* **@returns** `{void}`

Follow a basic example.

```javascript
canvas.render({
  node: {
    a: {
      x: 80, y: 100,
      width: 100,
      text: 'Drag me',
      outs: ['out1', 'out2', 'out3']
    },
    b: {
      x: 180, y: 200,
      text: 'Click me',
      ins: ['in0', { name: 'in1', type: 'bool' }],
      outs: ['return']
    }
  },
  link: {
    c: {
      from: ['a', 0],
      to: ['b', 1]
    }
  }
})
```

### Theme

Theme is a prop which defaults to

```javascript
  fontFamily: 'Courier',
  frameBorder: '1px solid black',
  highlightColor: 'lightsteelblue',
  lineWidth: 3,
  linkColor: 'gray',
  nodeBarColor: 'lightgray',
  nodeBodyHeight: 20,
  pinColor: 'darkgray',
  pinSize: 10
```

### Events

See [event/emitter.js][example_event_emitter] example.
The following events are emitted by [canvas](#canvas):

| name              | arguments             |
|-------------------|-----------------------|
| `createLink`      | link, linkId          |
| `createNode`      | node, nodeId          |
| `createInputPin`  | nodeId, position, pin |
| `createOutputPin` | nodeId, position, pin |
| `deleteLink`      | linkId                |
| `deleteNode`      | nodeId                |
| `deleteInputPin`  | nodeId, position      |
| `deleteOutputPin` | nodeId, position      |
| `renameNode`      | nodeId, text          |

### Node spec

A node describes an element and has the following attributes:

* **@param** `Number` *x* coordinate of top left vertex
* **@param** `Number` *y* coordinate of top left vertex
* **@param** `String` *text*
* **@param** `Array` *ins* list of input pins
* **@param** `Array` *outs* list of output pins
* **@param** `Number` *[width]*, defaults to a value depending on text lenght and number of pins.

An pin can be either a string or an object with the `name` attribute which must be a string.
Input pins default to string `in${position}`.
Output pins default to string `out${position}`.

### Link spec

A link describes a connection between elements and has the following attributes:

* **@param** `Array` *from* has exactly two elements
* **@param** `String` *from[0]* is the key of the source node
* **@param** `Number` *from[1]* is the output pin position
* **@param** `Array` *to* has exactly two elements
* **@param** `String` *to[0]* is the key of the target node
* **@param** `Number` *to[1]* is the input pin position

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

* [basic/usage.js][example_basic_usage] `npm run example_basic_usage`
* [custom/item.js][example_custom_item] `npm run example_custom_item`
* [event/emitter.js][example_event_emitter]: `npm run example_event_emitter`
* [empty/canvas.js][example_empty_canvas]: `npm run example_empty_canvas`
* [render/serverside.js][example_render_serverside]: `npm run example_render_serverside`

Note that examples are intended to be used for development, hence there
is an overhead at start time.
For instance: client side examples use hot reload, and are transpiled on the fly; also server side example will launch babel before starting.

## License

[MIT](http://g14n.info/mit-license)

[dflow]: http://g14n.info/dflow "dflow"
[dataflow_wikipedia]: https://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
[React]: https://facebook.github.io/react/
[example_basic_usage]: https://github.com/fibo/flow-view/blob/master/examples/basic/usage.js
[example_custom_item]: https://github.com/fibo/flow-view/blob/master/examples/custom/item.js
[example_empty_canvas]: https://github.com/fibo/flow-view/blob/master/examples/empty/canvas.js
[example_event_emitter]: https://github.com/fibo/flow-view/blob/master/examples/event/emitter.js
[example_render_serverside]: https://github.com/fibo/flow-view/blob/master/examples/render/serverside.js
[online_example]: http://g14n.info/flow-view/example "Online example"
[sample_view_svg]: https://g14n.info/flow-view/svg/sample-view.svg
