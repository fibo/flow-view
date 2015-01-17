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
            w: 100,
            h: 20,
            text: "Drag me",
            outs: [{name: "out0", data:1}]
          },
          b: {
            x: 180,
            y: 100,
            w: 100,
            h: 20,
            text: "Hello",
            ins: [{name: "in0", data:2}, {name: "in1", data:1}]
          }
       },
       link: {
         1: {
           from: ['a', 0],
           to: ['b', 1]
         }
       }
     }

  var canvas = new Canvas('drawing', view)
</script>
```

## Canvas

A *Canvas* need to know its *div* id which will be passed to [svg.js][1]. In your HTML file, put a *div* like this

```html
<div id="drawing"></div>
```

In order to start with a not empty *Canvas*, create an optional [view object](#view)


```
var view = {
      box: {
        a: {
          x: 80,
          y: 100,
          text: "Drag me",
          outs: [{name: "out0", data:1}]
        },
        b: {
          x: 180,
          y: 100,
          text: "Hello",
          ins: [{name: "in0", data:2}, {name: "in1", data:1}]
        }
     },
     link: {
        1: {
         from: ['a', 0],
         to: ['b', 1]
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

### w

The *width* of the rect containing the box.

### h

The *height* of the rect containing the box.

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

## Put

The *Put* object is an abstract class, furthermore it is not coded.

It has the following attributes

### name

It is a String with the name of the object.

### data

Can have any type that fits in a JSON attribute.

## Input

Is a [Put](#put) Object. Attribute [name](#name) defaults to `inP` where `P` is the *position* in the [ins](#ins) array.

```
ins: [{name: "in0", data:2}, {name: "in1", data:1}]
```

## Output

Is a [Put](#put) Object. Attribute [name](#name) defaults to `outP` where `P` is the *position* in the [outs](#outs) array.

```
outs: [{name: "out0", data:1}]
```


  [1]: http://svgjs.com/ "SVG.js"

