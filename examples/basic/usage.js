const Canvas = require('flow-view').Canvas

const view = {
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

const canvas = new Canvas()

canvas.load(view)

canvas.mountOn(document.getElementById('drawing'))
