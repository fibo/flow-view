var Canvas = require('flow-view').Canvas

var canvas = new Canvas('drawing', {
  nodeList: [
    'Homer',
    'Marge',
    'Bart',
    'Lisa',
    'Maggie'
  ]
})

canvas.render({
  node: {
    dad: {
      x: 10,
      y: 10,
      text: 'Homer',
      outs: [ 'is father of' ]
    },
    mom: {
      x: 120,
      y: 20,
      text: 'Marge',
      outs: [ 'is mother of' ]
    },
    son: {
      x: 20,
      y: 190,
      text: 'Bart',
      ins: ['father', 'mother']
    },
    daughter: {
      x: 180,
      y: 170,
      text: 'Lisa',
      ins: ['father', 'mother']
    }
  },
  link: {
    a: {
      from: ['dad', 0],
      to: ['son', 0]
    },
    b: {
      from: ['mom', 0],
      to: ['son', 1]
    },
    c: {
      from: ['dad', 0],
      to: ['daughter', 0]
    },
    d: {
      from: ['mom', 0],
      to: ['daughter', 1]
    }
  }
})
