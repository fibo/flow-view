const Canvas = require('flow-view').Canvas

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

const container = document.getElementById('drawing')

const canvas = new Canvas(container, graph)
