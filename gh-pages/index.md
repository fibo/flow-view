---
title: flow-view
flow: /empty.json
---
# flow-view

> is a visual editor for [Dataflow programming][3]

**Table Of Contents:**

* [Examples](http://g14n.info/flow-view/examples)
* [Description](#description)
* [Status](#status)
* [Installation](#installation)
* [Canvas](#canvas)
* [Events](#events)
* [Theme](#theme)
* [NodeSelector](#nodeselector)
* [Export](#export)
* [License](#license)

[![Whatchers](http://g14n.info/svg/github/watchers/flow-view.svg)](https://github.com/fibo/flow-view/watchers) [![Stargazers](http://g14n.info/svg/github/stars/flow-view.svg)](https://github.com/fibo/flow-view/stargazers) [![Forks](http://g14n.info/svg/github/forks/flow-view.svg)](https://github.com/fibo/flow-view/network/members)

[![NPM version](https://badge.fury.io/js/flow-view.svg)](http://badge.fury.io/js/flow-view) [![Build Status](https://travis-ci.org/fibo/flow-view.svg?branch=master)](https://travis-ci.org/fibo/flow-view?branch=master) [![Dependency Status](https://david-dm.org/fibo/flow-view.svg)](https://david-dm.org/fibo/flow-view) [![Change log](https://img.shields.io/badge/change-log-blue.svg)](http://g14n.info/flow-view/changelog)

<p><a href="http://codepen.io/collection/DojWVW/"><img src="http://blog.codepen.io/wp-content/uploads/2012/06/TryItOn-CodePen.svg" style="width: 10em; height: auto;" /></a></p>

[![NPM](https://nodei.co/npm-dl/flow-view.png)](https://nodei.co/npm-dl/flow-view/)

## Description

*flow-view* is a reusable visual editor you can use to provide a GUI to your dataflow project. I am using it for [dflow][2], but, I would like it'd be used by other node projects, like [graft](https://github.com/GraftJS/graft).

> Please, help me give Node a common visual interface. Use *flow-view*!

Any feedback is welcome!

## Installation

With [bower](http://bower.io/) do

```bash
$ bower install flow-view
```

or use a CDN adding this to your HTML page

```
<script src="https://cdn.rawgit.com/fibo/flow-view/master/dist/flow-view.min.js"></script>
```

Note that *flow-view* should be used client side. However, if you want to import it in your Node package
and bundle it with browserify, or whatever, you can install it with [npm](https://npmjs.org/) doing

```bash
$ npm install flow-view
```

## Synopsis

Go to [examples/synopsis][example-synopsis] to see results.

```
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

```
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

Go to [examples/event-log][example-event-log] to see results.

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

See [examples/custom-theme][example-custom-theme] to see result.

## NodeSelector

When you double click on svg canvas, a foreign object input text will appear;
you can use it to create new nodes.

The [NodeSelector](https://github.com/fibo/flow-view/blob/master/src/NodeSelector.js) supports autocompletion via [datalist](https://developer.mozilla.org/it/docs/Web/HTML/Element/datalist).


See [examples/autocompletion-from-url][example-autocompletion-from-url]

## Export

[Canvas](#canvas) has a `toJSON()` method that let you export its state.

See [examples/download-graph][example-download-graph] for a demo.

## License

[MIT](http://g14n.info/mit-license)

[1]: http://svgjs.com/ "SVG.js"
[2]: http://g14n.info/dflow "dflow"
[3]: https://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
[example-synopsis]: http://g14n.info/flow-view/examples/synopsis
[example-event-log]: http://g14n.info/flow-view/examples/event-log
[example-custom-theme]: http://g14n.info/flow-view/examples/custom-theme
[example-autocompletion-from-url]: http://g14n.info/flow-view/examples/autocompletion-from-url
[example-download-graph]: http://g14n.info/flow-view/examples/download-graph
