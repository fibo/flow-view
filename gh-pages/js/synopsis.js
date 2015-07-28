
var Canvas = require('flow-view').Canvas,
    view = {
      node: {
        a: {
          x: 80, y: 100,
          text: "Drag me",
          outs: [{name: "out0"}]
        },
        b: {
          x: 180,
          y: 200,
          w: 10,
          h: 1,
          link: 'http://g14n.info/flow-view',
          text: "Click me",
          ins: [{name: "in0"}, {name: "in1"}]
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

canvas.createView(view)

