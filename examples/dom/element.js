var Canvas = require('flow-view').Canvas

// Create a full screen div.
var element = document.createElement('div')
element.style.height = '100vh'
document.body.appendChild(element)

var canvas = new Canvas(element)

var view = {
  node: {
    a: {
      x: 80,
      y: 100,
      text: 'Drag me',
      outs: ['out1', 'out2', 'out3']
    },
    b: {
      x: 180,
      y: 200,
      text: 'Click me',
      ins: ['in0', { name: 'in1', type: 'bool' }],
      outs: ['return']
    }
  },
  link: {
    c: {
      from: ['a', 0],
      to: ['b', 1]
    }
  }
}

canvas.render(view)
