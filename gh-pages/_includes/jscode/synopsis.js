var Canvas = require('flow-view').Canvas
var view = {
   node: {
     a: {
       x: 80, y: 100,
       text: 'Drag me',
       outs: [{name: 'out0'}]
     },
     b: {
       x: 180,
       y: 200,
       w: 10,
       h: 1,
       text: 'Click me',
       ins: [{name: 'in0'}, {name: 'in1'}]
     }
  },
  link: {
    1: {
      from: ['a', 0],
      to: ['b', 1]
    }
  }
}

var canvas = new Canvas('drawing')

canvas.render(view)
