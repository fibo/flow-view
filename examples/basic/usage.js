const Canvas = require('flow-view').Canvas

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
        { name: 'out3', type: 'boolean' }
      ]
    },
    {
      id: 'b',
      x: 180,
      y: 200,
      text: 'Click me',
      ins: [
        { name: 'in0' },
        { name: 'in1', type: 'boolean' }
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
      to: ['b', 0]
    }
  ]
}

const container = document.getElementById('drawing')

const canvas = new Canvas(container)

canvas.loadGraph(graph)
