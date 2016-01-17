---
title: flow-view
flow: /empty.json
---
# flow-view

> is a visual editor for [Dataflow programming][3]

**Table Of Contents:**

* [Description](#description)
* [Status](#status)
* [Installation](#installation)
* [Canvas](#canvas)
* [Events](#events)
* [Theme](#theme)
* [NodeSelector](#nodeselector)
* [Export](#export)
* [License](#license)

See also [Examples](http://g14n.info/flow-view/examples) list.

[![NPM version](https://badge.fury.io/js/flow-view.svg)](http://badge.fury.io/js/flow-view) [![Dependency Status](https://gemnasium.com/fibo/flow-view.svg)](https://gemnasium.com/fibo/flow-view)

[![NPM](https://nodei.co/npm-dl/flow-view.png)](https://nodei.co/npm-dl/flow-view/)

## Description

*flow-view* is a reusable visual editor you can use to provide a GUI to your dataflow project. I am using it for [dflow][2], but, I would like it'd be used by other node projects, like [graft](https://github.com/GraftJS/graft).

> Please, help me give Node a common visual interface. Use *flow-view*!

Any feedback is welcome!

### Status

Current version **1.x** makes *flow-view* a minimal and (pretty much :)) extendible [Dataflow programming][3] visual editor.

Next version will drop [svg.js][1] dependency and will implement items as reusable React components.

Backward compatibility with the [view](#view) object data structure is **guaranteed**,
so you can start using *flow-view* right now, edit and save your data flows in JSON format,
and open them in the future with next *flow-view* versions.

The [theme format](#theme) does not satisfy me and will probably be changed for inline style inside components. Do not rely on it.
Try to use the default theme, if possible. By the way, it is a poor version of the mythic [vvvv](http://vvvv.org) *look&feel*.

Version **2.x** will give access to many possibilities, like server side SVG rendering,
nodes and links with custom shapes and behaviours, and all the goodies coming from the React world.

From now on, *flow-view* is considered stable: only bug fixes or important updates will be published on npm.

## Installation

With [bower](http://bower.io/) do

```bash
$ bower install flow-view
```

Note that *flow-view* should be used client side. However, if you want to import it in your Node package
and bundle it with browserify, or whatever, you can install it with [npm](https://npmjs.org/) doing

```bash
$ npm install flow-view
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
            text: 'Drag me',
            outs: [{name: 'out0'}]
          },
          b: {
            x: 180, y: 200,
            text: 'Hello',
            ins: [{name: 'in0'}, {name: 'in1'}]
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

  canvas.render(view)
</script>
```

## Canvas

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
          text: 'Drag me',
          outs: [{name: 'out0'}]
        },
        b: {
          x: 180, y: 100,
          text: 'Hello',
          ins: [{name: 'in0'}, {name: 'in1'}]
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

and render a view graph

```js
  canvas.render(view)
```

where the *view* object contains two collections:

  * [node](#view-node)
  * [link](#view-link)

Any other property of the *view* object will be just ignored.

Optional object can be passed as second argument, actually the *Canvas* contructor summary is the following

```
/**
 * Create a flow-view canvas.
 *
 * @constructor
 * @param {String} id of div element
 * @param {Object} arg
 * @param {Number} arg.height
 * @param {Number} arg.width
 * @param {Object} arg.eventHooks
 * @param {Object} arg.theme
 * @param {Object} arg.nodeSelector
 */
```

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

## Events

The following events are triggered

| eventName    | eventData                        |
| ------------ | -------------------------------- |
| addNode      | `{"text":"ciao","x":326,"y":82}` |
| addLink      | `{"from":["a",0],"to":["b",1]}`  |
| delNode      | `{"nodeid":"a"}`                 |
| delLink      | `{"linkid":"c"}`                 |
| moveNode     | `{"nodeid":"a","x":362,"y":98}`  |
| addInput     | `{"nodeid":"a","position":0}`    |
| addOutput    | `{"nodeid":"c","position":2}`    |
| renameNode   | `{"nodeid":"a","text":"foo"}`    |
| clickNode    | `{"nodeid":"a"}`                 |
| dblclickNode | `{"nodeid":"a"}`                 |

For example, I used events in [dflow][2] editor to save the view server side, using [Socket.IO](http://socket.io/).

Follows an example that uses events to log their data.

```
var eventNames = [
  'addLink' , 'addNode',
  'addInput', 'addOutput',
  'delLink' , 'delNode',
  'moveNode', 'renameNode',
  'clickNode', 'dblclickNode'
]

eventNames.forEach(function (eventName) {
  canvas.broker.on(eventName, function (ev) {
    console.log(eventName, ev)
  })
})
```

Go to [examples/event-log.html](http://g14n.info/flow-view/examples/event-log.html) to see results.

## Theme

Look&feel can be customized by passing a *theme* object to the [Canvas](#canvas) constructor.

Missing props will be filled with [default theme.json](https://github.com/fibo/flow-view/blob/master/src/default/theme.json) definition.

For example, create a canvas and overwrite few colors

```
var canvas = new Canvas('drawing', {
  theme: {
    fillPin: '#0288d1',
    fillPinHighlighted: '#ffc107',
    fillRect: '#03a9f4',
    strokeLine: {
      color: '#727272',
      width: 3
    },
    strokeLineHighlighted: {
      color: '#e64a19',
      width: 5
    }
  }
})
```

See [examples/custom-theme.html](http://g14n.info/flow-view/examples/custom-theme.html) to see result.

## NodeSelector

When you double click on svg canvas, a foreign object input text will appear;
you can use it to create new nodes.

The [NodeSelector](https://github.com/fibo/flow-view/blob/master/src/NodeSelector.js) supports autocompletion via [datalist](https://developer.mozilla.org/it/docs/Web/HTML/Element/datalist).


See [examples/autocompletion-from-url.html][example-autocompletion-from-url]

## Export

[Canvas](#canvas) has a `toJSON()` method that let you export its state.

See [examples/download-graph.html][example-download-graph] for a demo.

## License

[MIT](http://g14n.info/mit-license)

  [1]: http://svgjs.com/ "SVG.js"
  [2]: http://g14n.info/dflow "dflow"
  [3]: https://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
  [example-synopsis]: http://g14n.info/flow-view/examples/synopsis.html
  [example-event-log]: http://g14n.info/flow-view/examples/event-log.html
  [example-custom-theme]: http://g14n.info/flow-view/examples/custom-theme.html
  [example-autocompletion-from-url]: http://g14n.info/flow-view/examples/autocompletion-from-url.html
  [example-download-graph]: http://g14n.info/flow-view/examples/download-graph.html
