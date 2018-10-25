const Canvas = require('flow-view').Canvas

const graph = {
  nodes: [
    {
      id: 'dad',
      x: 20,
      y: 20,
      name: 'Homer',
      outs: [ { name: 'is father of' } ]
    },
    {
      id: 'mom',
      x: 120,
      y: 20,
      name: 'Marge',
      outs: [ { name: 'is mother of' } ]
    },
    {
      id: 'son',
      x: 20,
      y: 190,
      name: 'Bart',
      ins: [ { name: 'father' }, { name: 'mother' } ]
    },
    {
      id: 'daughter',
      x: 180,
      y: 170,
      name: 'Lisa',
      ins: [ { name: 'father' }, { name: 'mother' } ]
    }
  ],
  links: [
    {
      id: 'a',
      from: ['dad', 0],
      to: ['son', 0]
    },
    {
      id: 'b',
      from: ['mom', 0],
      to: ['son', 1]
    },
    {
      id: 'c',
      from: ['dad', 0],
      to: ['daughter', 0]
    },
    {
      id: 'd',
      from: ['mom', 0],
      to: ['daughter', 1]
    }
  ]
}

const container = document.getElementById('drawing')

const canvas = new Canvas(container)

canvas.loadGraph(graph)
