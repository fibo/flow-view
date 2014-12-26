
var view = {
  box: {
    a: {
      x: 80,
      y: 100,
      text: "Drag me",
      outs: [{}]
    }
    b: {
      x: 180,
      y: 100,
      text: "Hello",
      ins: [{}, {}]
    }
  },
  link: {
    1: {
      from: ['a', 0],
      to: ['b', 1]
    }
  }
}

var canvas = new flowView.Canvas('drawing', view)

