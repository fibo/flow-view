# flow-view

> is a visual editor for [Dataflow programming][dataflow_wikipedia]

[Installation](#installation) |
[API](#api) |
[Grapg schema](#graph-schema) |
[Examples](#examples) |
[License](#license)

[![Whatchers](http://g14n.info/svg/github/watchers/flow-view.svg)](https://github.com/fibo/flow-view/watchers) [![Stargazers](http://g14n.info/svg/github/stars/flow-view.svg)](https://github.com/fibo/flow-view/stargazers) [![Forks](http://g14n.info/svg/github/forks/flow-view.svg)](https://github.com/fibo/flow-view/network/members)

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
<script src="https://unpkg.com/flow-view/dist/flow-view.min.js"></script>
```

## API

### Canvas constructor

To import *flow-view* Canvas choose your favourite syntax among:

* `const Canvas = require('flow-view').Canvas`
* `import { FlowViewCanvas } from 'flow-view'`

Suppose your *container* is a div with id `drawing`.
In your HTML, place a div where you want to mount flow-view canvas.

```html
<div id="drawing"></div>
```

Create an empty canvas.

```javascript
const container = document.getElementById('drawing')

const canvas = new Canvas(container)
```

### loadGraph

You can load a [graph](graph-schema) like in the following example.

```javascript
const graph = {
  nodes: [
    {
      id: 'a',
      x: 80,
      y: 100,
      name: 'Drag me',
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
      name: 'Click me',
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

canvas.loadGraph(graph)
```

## Graph schema

This section defines flow-view [JSON Schema](http://json-schema.org/) using [cson](https://github.com/bevry/cson).
It is parsed by [markdown2code](http://g14n.info/markdown2code) to generate [flow-view schema.json file](http://g14n.info/flow-view/schema.json).

```cson
$schema: 'http://json-schema.org/schema#'
id: 'http://g14n.info/flow-view/schema.json'
properties:
```

A flow-view *graph* has [links](#links) and [nodes](#nodes).

### Links

A *graph* can have none, one or many *links*.

```cson
  links:
    type: 'array'
    items:
```

Every *link* must have a unique *id*.

```cson
      title: 'link'
      type: 'object'
      properties:
        id:
          type: 'string'
```

A *link* connects two *nodes*.

It starts *from* a *node output* which is identified by an array of two
elements that are the source *node id* and the *output position*.

```cson
        from:
          type: 'array'
          items: [
            { type: 'string' }
            { type: 'number' }
          ]
          minLength: 2
          maxLength: 2
```

It goes *to* a *node input* which is identified by an array of two elements
that are the target *node id* and the *input position*.

```cson
        to:
          type: 'array'
          items: [
            { type: 'string' }
            { type: 'number' }
          ]
          minLength: 2
          maxLength: 2
```

All properties are required.

```cson
      required: [
        'id'
        'from'
        'to'
      ]
```

### Nodes

A *graph* can have none, one or many *nodes*.

```cson
  nodes:
    type: 'array'
    items:
```

Every *node* must have a unique *id*.

```cson
      title: 'node'
      type: 'object'
      properties:
        id:
          type: 'string'
```

A node has a *text*.

```cson
        text:
          type: 'string'
```

A node has a position identified by *x* and *y* coordinates.

```cson
        x:
          type: 'number'
        y:
          type: 'number'
```

A node at the end is a block with inputs and outputs. Both *ins* and *outs*
must have a *name* and may have a *type*.

```cson
        ins:
          type: 'array'
          items:
            title: 'in'
            type: 'object'
            properties:
              name:
                type: 'string'
              type:
                type: 'string'
            required: [
              'name'
            ]
        outs:
          type: 'array'
          items:
            title: 'out'
            type: 'object'
            properties:
              name:
                type: 'string'
              type:
                type: 'string'
            required: [
              'name'
            ]
```

Properties *ins* and *outs* are not required. A node with *ins* not defined
is a *root*, a node with *outs* not defined is a *leaf*.

```cson
      required: [
        'id'
        'text'
        'x'
        'y'
      ]
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
[basic_usage_gif]: https://g14n.info/flow-view/media/basic-usage.gif "Basic usage example"
