var Canvas = require('flow-view').Canvas
var view = {
  width: 400, height: 300,
  node: {
    a: {
      x: 80, y: 100,
      width: 100,
      text: 'Drag me',
      outs: [{ name: 'out0' }]
    },
    b: {
      x: 180, y: 200,
      width: 100,
      text: 'Click me',
      ins: [{ name: 'in0' }, { name: 'in1' }]
    }
  },
  link: {
    c: {
      from: ['a', 0],
      to: ['b', 1]
    }
  }
}

var canvas = new Canvas('drawing')

canvas.render(view)
