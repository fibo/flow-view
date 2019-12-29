# flow-view

> is a visual editor for [Dataflow programming][dataflow_wikipedia]

[Installation](#installation) |
[API](#api) |
[Graph schema](#graph-schema) |
[Examples](#examples) |
[License](#license)

[![Whatchers](https://g14n.info/svg/github/watchers/flow-view.svg)](https://github.com/fibo/flow-view/watchers) [![Stargazers](https://g14n.info/svg/github/stars/flow-view.svg)](https://github.com/fibo/flow-view/stargazers) [![Forks](https://g14n.info/svg/github/forks/flow-view.svg)](https://github.com/fibo/flow-view/network/members)

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

### FlowViewCanvas constructor

To import `FlowViewCanvas` choose your favourite syntax among:

* `const { FlowViewCanvas } = require('flow-view')`
* `import { FlowViewCanvas } from 'flow-view'`

Suppose your *container* is a div with id `drawing`.
In your HTML, place a div where you want to mount flow-view canvas.

```html
<div id="drawing"></div>
```

Create an empty canvas.

```javascript
const container = document.getElementById('drawing')

const canvas = new FlowViewCanvas(container)
```

If passed to constructor is not an instance of `HTMLDivElement`, a new `div` will be created and appended to `document.body`.

### loadGraph

You can load a [graph](#graph-schema) like in the following example.

<!-- sync with examples/basic/usage.js -->

```javascript
const graph = {
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
        { name: 'in1' },
        { name: 'in2' }
      ],
      outs: [
        { id: 'out4' }
      ]
    }
  ],
  links: [
    {
      id: 'c',
      from: ['out1'],
      to: ['in1']
    }
  ]
}

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
      title: 'node'
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
            title: 'in'
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
            title: 'out'
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
      title: 'link'
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
[example_event_emitter]: https://github.com/fibo/flow-view/blob/master/examples/event/emitter.js
[example_genealogic_tree]: https://github.com/fibo/flow-view/blob/master/examples/genealogic/tree.js
[online_example]: http://g14n.info/flow-view/example "Online example"
[basic_usage_gif]: https://g14n.info/flow-view/media/basic-usage.gif "Basic usage example"
