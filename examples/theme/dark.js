var Canvas = require('flow-view').Canvas

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

const baseColor = 'gray'

const border = {
  width: 2,
  style: 'solid',
  color: baseColor
}

var canvas = new Canvas('drawing', {
  theme: {
    frame: {
      border,
      color: {
        primary: 'slategray',
        dark: 'darkslategray'
      },
      font: {
        family: 'Courier',
        size: 12
      }
    },
    link: {
      color: 'darkgrey',
      width: 3
    },
    node: {
      body: {
        color: 'white',
        height: 15
      },
      color: baseColor,
      pin: {
        color: 'darkgrey',
        size: 10
      }
    },
    selector: { border }
  }
})

canvas.render(view)
