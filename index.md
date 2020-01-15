---
title: flow-view
---
# flow-view

> is a visual editor for [Dataflow programming][dataflow_wikipedia]

[Installation](#installation) |
[API](#api) |
[Graph schema](#graph-schema) |
[License](#license)

[![NPM version](https://badge.fury.io/js/flow-view.svg)](http://badge.fury.io/js/flow-view)
[![Build Status](https://travis-ci.org/fibo/flow-view.svg?branch=master)](https://travis-ci.org/fibo/flow-view?branch=master)
[![Dependency Status](https://david-dm.org/fibo/flow-view.svg)](https://david-dm.org/fibo/flow-view)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Change log](https://img.shields.io/badge/change-log-blue.svg)](http://g14n.info/flow-view/changelog)

![Basic usage][basic_usage_gif]

## Installation

### Using npm

With [npm](https://npmjs.org/) do

```bash
npm install flow-view
```

### Using a CDN

Adding this to your HTML page

```html
<link rel="stylesheet" href="https://unpkg.com/flow-view/dist/flow-view.min.css">
<script type="module">
  import { FlowViewCanvas } from 'https://unpkg.com/flow-view/dist/flow-view.min.js'

  // Your code here.
</script>
```

## API

### FlowViewCanvas constructor

Suppose your *container* is a div with id `drawing`.
In your HTML, place a div where you want to mount flow-view canvas.

```html
<style>
  #drawing { height: 400px; }
</style>

<div id="drawing"></div>
```

Create an empty canvas.

```javascript
const container = document.getElementById('drawing')

const canvas = new FlowViewCanvas(container)
```

It is supposed to use a `FlowViewCanvas` graphically; nevertheless you can create nodes, links, inputs and outputs programmatically.
For example:

```javascript
const node1 = canvas.createNode({ x: 20, y: 50, text: 'Drag me' })
const node2 = canvas.createNode({ x: 100, y: 100, text: 'I am a node' })

const link = canvas.createLink()

const source1 = node1.createOutput()
const target1 = node2.createInput()

canvas.connect(source1).to(link)
canvas.connect(target1).to(link)
```

### loadGraph

You can load a [graph](#graph-schema) like in the following example.

```javascript
const graph = {
  nodes: [
    {
      id: 'a', x: 80, y: 100, text: 'Drag me',
      outs: [ { id: 'out1' }, { id: 'out2' }, { id: 'out3' } ]
    },
    {
      id: 'b', x: 180, y: 200, text: 'Click me',
      ins: [ { id: 'in1' }, { id: 'in2' } ],
      outs: [ { id: 'out4' } ]
    }
  ],
  links: [
    { id: 'c', from: 'out1', to: 'in1' }
  ]
}

canvas.loadGraph(graph)
```

## Graph schema

This section defines flow-view [JSON Schema](http://json-schema.org/) using [cson](https://github.com/bevry/cson).
It is parsed by [markdown2code](http://g14n.info/markdown2code) to generate [flow-view schema.json file](http://g14n.info/flow-view/schema.json).

```yaml
$schema: 'http://json-schema.org/schema#'
id: 'http://g14n.info/flow-view/schema.json'
properties:
```

A flow-view *graph* has [links](#links) and [nodes](#nodes).

### Nodes

A *graph* can have none, one or many *nodes*.

```yaml
  nodes:
    type: 'array'
    items:
```

Every *node* must have a unique *id*.

```yaml
      title: 'nodes'
      type: 'object'
      properties:
        id:
          type: 'string'
```

A node has a *text*.

```yaml
        text:
          type: 'string'
```

A node has a position identified by *x* and *y* coordinates.

```yaml
        x:
          type: 'number'
        y:
          type: 'number'
```

A node at the end is a block with inputs and outputs. Both *ins* and *outs* must have an *id*.

```yaml
        ins:
          type: 'array'
          items:
            title: 'ins'
            type: 'object'
            properties:
              id:
                type: 'string'
            required: [
              'id'
            ]
        outs:
          type: 'array'
          items:
            title: 'outs'
            type: 'object'
            properties:
              id:
                type: 'string'
            required: [
              'id'
            ]
```

Properties *ins* and *outs* are not required. A node with *ins* not defined is a *root*, a node with *outs* not defined is a *leaf*.

```yaml
      required: [
        'id'
        'text'
        'x'
        'y'
      ]
```

### Links

A *graph* can have none, one or many *links*.

```yaml
  links:
    type: 'array'
    items:
```

Every *link* must have a unique *id*.

```yaml
      title: 'links'
      type: 'object'
      properties:
        id:
          type: 'string'
```

A *link* connects two *nodes*, in particular connects an output of a node to an input of another node.

It starts *from* a *node output*, where *from* holds the output id.

```yaml
        from:
          type: 'string'
```

It goes *to* a *node input*, where *to* holds the input id.

```yaml
        to:
          type: 'string'
```

All properties are required.

```yaml
      required: [
        'id'
        'from'
        'to'
      ]
```

## License

[MIT](http://g14n.info/mit-license)

[dflow]: http://g14n.info/dflow "dflow"
[dataflow_wikipedia]: https://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
[basic_usage_gif]: https://g14n.info/flow-view/media/basic-usage.gif "Basic usage example"
