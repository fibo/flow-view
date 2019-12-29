const { FlowViewCanvas } = require('flow-view')

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

const container = document.getElementById('drawing')

const canvas = new FlowViewCanvas(container)

canvas.loadGraph(graph)
