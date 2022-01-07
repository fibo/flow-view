# flow-view

> is a visual editor for [dataflow programming][dataflow_wikipedia]

<a href="http://g14n.info/flow-view/">
<div>Demo</div>
<img width="517" height="490" src="screenshot.png" alt="flow view Simpsons example">
</a>

## Installation

### Using npm

With [npm](https://npmjs.org/) do

```bash
npm install flow-view
```

### Using a CDN

Try this in your HTML page

```html
<script type="module">
  import { FlowView } from 'https://unpkg.com/flow-view'

  const flowView = new FlowView()
</script>
```

## Usage

### GUI

Try <a href="http://g14n.info/flow-view/">demo here</a>.

<ul>
  <li>Drag on canvas to translate all items.</li>
  <li>Click on item to select it.</li>
  <li>Click while pressing <kbd>SHIFT</kbd> to enable <b>multi</b> selection.</li>
  <li>Drag selected items to translate them.</li>
  <li>Drag from a node output to a node input to create an edge.</li>
  <li>Press <kbd>BACKSPACE</kbd> to delete selected items.</li>
  <li>Double click on canvas to open the <b>selector</b>.</li>
  <li>Type into the selector then press <kbd>ENTER</kbd> to create a new node.</li>
</ul>

### Constructor

Create a `FlowView` instance and pass it a `container` argument. It will create
a `flow-view` custom element and attach it to the _container_. If no argument is
provided, default _container_ will be `document.body`. Be aware that the
`flow-view` custom element will fit the whole height of its container, so make
sure to style properly to avoid a zero height container.

```html
<!DOCTYPE html>
<html>
  <body>
    <script type="module">
      import { FlowView } from 'https://unpkg.com/flow-view';

      const flowView = new FlowView({ container: document.body });
    </script>
  </body>
</html>
```

If some `flow-view` custom element is already in the page, it can be passed to a
`FlowView` instance via the `element` argument.

```html
<!DOCTYPE html>
<html>
  <body>
    <flow-view id="my-view"></flow-view>

    <script type="module">
      import { FlowView } from 'https://unpkg.com/flow-view';

      const flowView = new FlowView({ element: document.getElementById('my-view') });
    </script>
  </body>
</html>
```

There is another parameter which is _optional_ but it makes sense to be provided
in the majority of use cases, that is **node definitions**. It is used to define
which nodes are available and how many inputs and outputs they have.

```javascript
new FlowView({
  nodes: [
    {
      label: "Sum",
      inputs: [
        {
          name: "input1",
        },
        {
          name: "input2",
        },
      ],
      outputs: [
        {
          name: "output",
        },
      ],
    },
  ],
});
```

### `loadGraph({ nodes = [], edges = [] })`

Load a _flow-view_ graph.

```javascript
flowView.loadGraph({
  nodes: [
    {
      id: "dad",
      label: "Homer",
      x: 60,
      y: 70,
      outputs: [{ id: "children" }],
    },
    {
      id: "mom",
      label: "Marge",
      x: 160,
      y: 70,
      outputs: [{ id: "children" }],
    },
    {
      id: "son",
      label: "Bart",
      x: 60,
      y: 240,
      inputs: [{ id: "father" }, { id: "mother" }],
    },
    {
      id: "daughter",
      label: "Lisa",
      x: 220,
      y: 220,
      inputs: [{ id: "father" }, { id: "mother" }],
    },
  ],
  edges: [
    { from: ["dad", "children"], to: ["son", "father"] },
    { from: ["dad", "children"], to: ["daughter", "father"] },
    { from: ["mom", "children"], to: ["son", "mother"] },
    { from: ["mom", "children"], to: ["daughter", "mother"] },
  ],
});
```

### `newNode()` and `newEdge()`

Create nodes and edges programmatically. See
<a href="http://g14n.info/flow-view/examples/programmatic">programmatic example
here</a>.

```javascript
const node1 = flowView.newNode({
  label: "Hello",
  inputs: [{}, {}],
  outputs: [{ id: "output1" }],
  x: 100,
  y: 100,
  width: 80,
});
const node2 = flowView.newNode({
  label: "World",
  inputs: [{ id: "input1" }],
  width: 100,
  x: 250,
  y: 400,
});
flowView.newEdge({
  from: [node1.id, "output1"],
  to: [node2.id, "input1"],
});
```

## License

[MIT](http://g14n.info/mit-license)

[dataflow_wikipedia]: https://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
