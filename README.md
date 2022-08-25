# flow-view

> is a visual editor for [dataflow programming][dataflow_wikipedia]

<a href="http://fibo.github.io/flow-view/">
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
  import { FlowView } from 'https://unpkg.com/flow-view';

  const flowView = new FlowView();
</script>
```

### Old school

Just download the `flow-view.js` build [from here](https://github.com/fibo/flow-view/blob/main/flow-view.js), upload it
wherever you like and load it with a `script` tag like

```html
<script type="module" src="https://your.domain.com/path/to/flow-view.js"></script>
```

## Usage

### GUI

Try <a href="http://fibo.github.io/flow-view/">demo here</a>.

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

Create a `FlowView` instance and pass it a `container` argument. It will create a `flow-view` custom element and attach
it to the _container_. If no argument is provided, default _container_ will be `document.body`. Be aware that the
`flow-view` custom element will fit the whole height of its container, so make sure to style properly to avoid a zero
height container.

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

If some `flow-view` custom element is already in the page, it can be passed to a `FlowView` instance via the `element`
argument.

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

Add a list to define which nodes are available. It is not required but it makes sense to be provided in the majority of
use cases.

```javascript
flowView.addNodeDefinitions({
	nodes: [
		{ name: "Marge" },
		{ name: "Homer" },
		{ name: "Bart" },
		{ name: "Lisa" },
	],
});
```

### `node(id)`

Get _flow-view_ node by id.

```javascript
const node = flowView.node("abc");
```

### `edge(id)`

Get _flow-view_ edge by id.

```javascript
const edge = flowView.edge("abc");
```

### `graph`

Access current _flow-view_ graph.

```javascript
console.log(flowView.graph);
```

### `loadGraph({ nodes = [], edges = [] })`

Load a _flow-view_ graph.

```javascript
flowView.loadGraph({
	nodes: [
		{
			id: "dad",
			text: "Homer",
			x: 60,
			y: 70,
			outs: [{ id: "children" }],
		},
		{
			id: "mom",
			text: "Marge",
			x: 160,
			y: 70,
			outs: [{ id: "children" }],
		},
		{
			id: "son",
			text: "Bart",
			x: 60,
			y: 240,
			ins: [{ id: "father" }, { id: "mother" }],
		},
		{
			id: "daughter",
			text: "Lisa",
			x: 220,
			y: 220,
			ins: [{ id: "father" }, { id: "mother" }],
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

### `clearGraph()`

Empty current graph.

```javascript
flowView.clearGraph();
```

### `destroy()`

Delete `flow-view` custom element.

```javascript
flowView.destroy();
```

An use case for `destroy()` is the following. Suppose you are using Next.js, you need to load `flow-view` with an async
import into a `useEffect` which needs to return a callback to be called when component is unmounted.

This is a sample code.

```typescript
import type { FlowView } from "flow-view";
import { FC, useEffect, useRef } from "react";

const MyComponent: FC = () => {
	const flowViewContainerRef = useRef<HTMLDivElement | null>(null);
	const flowViewRef = useRef<FlowView | null>(null);

	useEffect(() => {
		let unmounted = false;

		const importFlowView = async () => {
			if (unmounted) return;
			if (flowViewContainerRef.current === null) return;
			if (flowViewRef.current !== null) return;

			const { FlowView } = await import("flow-view");

			const flowView = new FlowView({
				container: flowViewContainerRef.current,
			});
			flowViewRef.current = flowView;
		};

		importFlowView();

		return () => {
			unmounted = true;
			if (flowViewRef.current !== null) flowViewRef.current.destroy();
		};
	}, [flowViewRef, flowViewContainerRef]);

	return <div ref={flowViewContainerRef}></div>;
};
```

### `newNode()` and `newEdge()`

Create nodes and edges programmatically. See
<a href="http://fibo.github.io/flow-view/examples/programmatic/index.html">programmatic example here</a>.

```javascript
// Create two nodes.

const node1 = flowView.newNode({
	text: "Hello",
	ins: [{}, {}],
	outs: [{ id: "output1" }],
	x: 100,
	y: 100,
	width: 80,
});
const node2 = flowView.newNode({
	text: "World",
	ins: [{ id: "input1" }],
	width: 100,
	x: 250,
	y: 400,
});

// Connect nodes with an edge.
flowView.newEdge({
	from: [node1.id, "output1"],
	to: [node2.id, "input1"],
});
```

### `deleteNode()` and `deleteEdge()`

Delete nodes and edges programmatically. Notice that when a node is deleted, all its connected edges are deleted too.

```javascript
const nodeId = "abc";
const edgeId = "123";

flowView.deleteNode(nodeId);
flowView.deleteEdge(edgeId);
```

### `addNodeClass(nodeType, NodeClass)`

Can add custom node class. See
<a href="http://fibo.github.io/flow-view/examples/custom-node/index.html">custom node example here</a>.

### `onChange(callback)`

React to _flow-view_ changes. See
<a href="https://github.com/fibo/flow-view/blob/main/index.html">demo code here</a>.

Callback signature is `({ action, data }, info) => void`, where

- **action** can be `CREATE_NODE`, `DELETE_NODE`, ecc
- **data** change based on action
- **info** can contain `{ isLoadGraph: true }` or other optional information.

Just take advantage of autocompletion and suggestion provided by
[typings definitions](https://github.com/fibo/flow-view/blob/main/flow-view.d.ts).

## License

[MIT](http://fibo.github.io/mit-license)

[dataflow_wikipedia]: https://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
