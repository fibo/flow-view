# flow-view

> Visual editor for dataflow programming, powered by [svg.js][1]

[![NPM version](https://badge.fury.io/js/flow-view.png)](http://badge.fury.io/js/flow-view) [![Build Status](https://travis-ci.org/fibo/flow-view.png?branch=master)](https://travis-ci.org/fibo/flow-view.png?branch=master) [![Dependency Status](https://gemnasium.com/fibo/flow-view.png)](https://gemnasium.com/fibo/flow-view) [![Stories in Ready](https://badge.waffle.io/fibo/flow-view.png?label=ready&title=Ready)](https://waffle.io/fibo/flow-view)

[![NPM](https://nodei.co/npm-dl/flow-view.png)](https://nodei.co/npm-dl/flow-view/)

## Description

*flow-view* is a reusable visual editor you can use to provide a GUI to your dataflow project. I am using it for [dflow](http://g14n.info/dflow), but, I would like it'd be used by other node projects, like [graft](https://github.com/GraftJS/graft).

> Please, help me give Node a common visual interface. Use *flow-view*!

Any feedback is welcome!

## Installation

With [npm](https://npmjs.org/) do

```bash
$ npm install flow-view
```

With [bower](http://bower.io/) do

```bash
$ bower install flow-view
```

## Synopsis

Go to [examples/synopsis.html](http://g14n.info/flow-view/examples/synopsis.html) to see results.

```html
<div id="drawing"></div>
<script type="text/javascript" src="path/to/flowView.js"></script>
<script type="text/javascript">
  var Canvas = require(flow-view).Canvas,
      view = {
        node: {
          a: {
            x: 80, y: 100,
            text: "Drag me",
            outs: [{name: "out0"}]
          },
          b: {
            x: 180, y: 200,
            text: "Hello",
            ins: [{name: "in0"}, {name: "in1"}]
          }
       },
       link: {
         1: {
           from: ['a', 0],
           to: ['b', 1]
         }
       }
     }

  var canvas = new Canvas('drawing')

  canvas.createView(view)
</script>
```

### Canvas

A *Canvas* need to know its *div* id which will be passed to [svg.js][1]. In your HTML file, put a *div* like this

```html
<div id="drawing"></div>
```

Create a [view object](#view)

```
var view = {
      node: {
        a: {
          x: 80, y: 100,
          text: "Drag me",
          outs: [{name: "out0"}]
        },
        b: {
          x: 180, y: 100,
          text: "Hello",
          ins: [{name: "in0"}, {name: "in1"}]
        }
     },
     link: {
        1: {
         from: ['a', 0],
         to: ['b', 1]
     }
   }
```

Create a *canvas* instance

```js
  var canvas = new Canvas('drawing')
```

and pass it its view

```js
  canvas.createView(view)
```

### view

The *view* object contains two collections:

  * node
  * link

### view.node

The *view.node* collection contains the canvas nodes, that are objects with the following attributes

#### x

The *x* coord of the top left vertex of the node.

#### y

The *y* coord of the top left vertex of the node.

#### w

The *width* of the rect containing the node. It is expressed in width units.
It defaults to a value enough to contain node text.

#### h

The *height* of the rect containing the node. It is expressed in height units.
It defaults to 1.

#### text

The *text* label displayed in the node.

#### ins

An optional list of *node inputs*, which are objects that can contain anything accepted by JSON.

#### outs

An optional list of *node outputs*, which are objects that can contain anything accepted by JSON.

### view.link

The *view.link* collection contains the canvas links, that are objects with the following attributes

#### from

An array with two entries:

  0. The key of the source node.
  1. The position of the output.

#### to

An array with two entries:

  0. The key of the target node.
  1. The position of the input.

### Events

The following events are triggered

* addNode
* addLink
* delNode
* delLink
* moveNode
* addInput
* addOutput

  [1]: http://svgjs.com/ "SVG.js"

