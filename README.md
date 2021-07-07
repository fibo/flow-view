# flow-view

> is a visual editor for [Dataflow programming][dataflow_wikipedia]

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

  const node1 = flowView.newNode({
    label: 'Yay', inputs:[{}, {}], outputs: [{ id: 'output1' }], x: 100, y: 100, width: 80
  });
  const node2 = flowView.newNode({
    label: 'node2', inputs:[{ id: 'input1' }], width: 100, x: 250, y: 400
  });
  flowView.newEdge({
    from: [node1.id, 'output1'],
    to: [node2.id, 'input1']
  })
</script>
```

## License

[MIT](http://g14n.info/mit-license)

[dataflow_wikipedia]: https://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
