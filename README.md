flow-view
=========

> Visual editor for dataflow programming, powered by [svg.js][1]

[![NPM version](https://badge.fury.io/js/flow-view.png)](http://badge.fury.io/js/flow-view) [![Build Status](https://travis-ci.org/fibo/flow-view.png?branch=master)](https://travis-ci.org/fibo/flow-view.png?branch=master) [![Dependency Status](https://gemnasium.com/fibo/flow-view.png)](https://gemnasium.com/fibo/flow-view)

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

Go to [examples/synopsis/](http://g14n.info/flow-view/examples/synopsis/) to see results.

```html
<div id="drawing"></div>
<script type="text/javascript" src="path/to/flowView.js"></script>
<script type="text/javascript">
  var Canvas = flowView.Canvas,
      view = {
        box: {
          a: {
            x: 80,
            y: 100,
            text: "Drag me",
            outs: [{}]
          },
          b: {
            x: 180,
            y: 100,
            text: "Hello",
            ins: [{}, {}]
          }
       },
       link: {
         1: {
           from: ['a', 0],
           to: ['b', 1]
       }
     }

  canvas = new Canvas('drawing', view)
</script>
```

## Canvas

A *Canvas* need to know its *div* id which will be passed to [svg.js][1]. In your HTML file, put a *div* like this

```html
<div id="drawing"></div>
```

In order to start with a not empty *Canvas*, create an optional [view object](#view)

```js
view = {
  box: {
    foo: {
      x: 10,
      y: 10,
      text: "Drag mew"
    }
 }
```

and pass it to the *Canvas* constructor

```js
var canvas = new flowView.Canvas('drawing', view)
```

### addBox()

```js
canvas.addBox()
```

### addLink()

```js
canvas.addLink()
```

### view

The *view* object contains two objects:

  * box
  * link

## Box

The *Box* constructor should not be used directly, use [addBox()](#addbox) instead.

### x

The *x* coord of the top left vertex of the box.

### y

The *y* coord of the top left vertex of the box.

### text

The *text* label displayed in the box.

### ins

An optional array of [Input](#input) objects.

### outs

An optional array of [Ouput](#output) objects.

## Link

The *Link* constructor should not be used directly, use [addLink()](#addlink) instead.

### from

An array with two entries:

  0. The key of the source box.
  1. The position of the output.

### to

An array with two entries:

  0. The key of the target box.
  1. The position of the input.

  [1]: http://svgjs.com/ "SVG.js"

