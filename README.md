# flow-view

> is a visual editor for [Dataflow programming][dataflow_wikipedia]

<<<<<<< HEAD [Installation](#installation) | [API](#api) |
[Graph schema](#graph-schema) | [License](#license)

[![NPM version](https://badge.fury.io/js/flow-view.svg)](http://badge.fury.io/js/flow-view)
[![Dependency Status](https://david-dm.org/fibo/flow-view.svg)](https://david-dm.org/fibo/flow-view)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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

Suppose your _container_ is a div with id `drawing`. In your HTML, place a div
where you want to mount flow-view canvas.

```html
<style>
  #drawing { height: 400px; }
</style>

<div id="drawing"></div>
```

Create an empty canvas.

```javascript
const container = document.getElementById("drawing");

const canvas = new FlowViewCanvas(container);
```

It is supposed to use a `FlowViewCanvas` graphically; nevertheless you can
create nodes, links, inputs and outputs programmatically. For example:

```javascript
const node1 = canvas.createNode({ x: 20, y: 50, text: "Drag me" });
const node2 = canvas.createNode({ x: 100, y: 100, text: "I am a node" });

const link = canvas.createLink();

const source1 = node1.createOutput();
const target1 = node2.createInput();

canvas.connect(source1).to(link);
canvas.connect(target1).to(link);
```

### loadGraph

You can load a [graph](#graph-schema) using the `loadGraph` method, like in the
following example.

```javascript
const graph = {
  nodes: [
    {
      id: "a",
      x: 80,
      y: 100,
      text: "Drag me",
      outs: [{ id: "out1" }, { id: "out2" }, { id: "out3" }],
    },
    {
      id: "b",
      x: 180,
      y: 200,
      text: "Click me",
      ins: [{ id: "in1" }, { id: "in2" }],
      outs: [{ id: "out4" }],
    },
  ],
  links: [
    { id: "c", from: "out1", to: "in1" },
  ],
};

canvas.loadGraph(graph);
```

### getGraph

Get the canvas [graph](#graph-schema) using the `getGraph` method which returns
an object, you can then serialize into JSON.

```javascript
const graph = canvas.getGraph();

console.log(JSON.stringify(graph));
```

## Graph schema

This section defines flow-view [JSON Schema](http://json-schema.org/) using
[cson](https://github.com/bevry/cson). It is parsed by
[markdown2code](http://g14n.info/markdown2code) to generate
[flow-view schema.json file](http://g14n.info/flow-view/schema.json).

```yaml
$schema: 'http://json-schema.org/schema#'
id: 'http://g14n.info/flow-view/schema.json'
properties:
```

A flow-view _graph_ has [links](#links) and [nodes](#nodes).

### Nodes

A _graph_ can have none, one or many _nodes_.

```yaml
nodes:
    type: 'array'
    items:
```

Every _node_ must have a unique _id_.

```yaml
title: 'nodes'
      type: 'object'
      properties:
        id:
          type: 'string'
```

A node has a _text_.

```yaml
text:
          type: 'string'
```

A node has a position identified by _x_ and _y_ coordinates.

```yaml
x:
          type: 'number'
        y:
          type: 'number'
```

A node at the end is a block with inputs and outputs. Both _ins_ and _outs_ must
have an _id_.

```yaml
ins:
          type: 'array'
          items:
            title: 'inputs'
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
            title: 'outputs'
            type: 'object'
            properties:
              id:
                type: 'string'
            required: [
              'id'
            ]
```

Properties _ins_ and _outs_ are not required. A node with _ins_ not defined is a
_root_, a node with _outs_ not defined is a _leaf_.

```yaml
required: [
        'id'
        'text'
        'x'
        'y'
      ]
```

### Links

A _graph_ can have none, one or many _links_.

```yaml
links:
    type: 'array'
    items:
```

Every _link_ must have a unique _id_.

```yaml
title: 'links'
      type: 'object'
      properties:
        id:
          type: 'string'
```

A _link_ connects two _nodes_, in particular connects an output of a node to an
input of another node.

It starts _from_ a _node output_, where _from_ holds the output id.

```yaml
from:
          type: 'string'
```

It goes _to_ a _node input_, where _to_ holds the input id.

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

=======

## License

[MIT](http://g14n.info/mit-license)

[dataflow_wikipedia]: https://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"

> > > > > > > next
