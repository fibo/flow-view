
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
          text: "Hello",
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

var eventHooks = {
  afterMoveNode: function (eventData) { console.log('moveNode', eventData) },
  beforeAddLink: function (view) { console.log('addLink', view) },
  beforeAddNode: function (view) { console.log('addNode', view) },
  beforeAddInput: function (eventData) { console.log('addInput', eventData) },
  beforeDelLink: function (key) { console.log('delLink', key) },
  beforeDelNode: function (key) { console.log('delNode', key) }
}

var canvas = new Canvas('drawing', eventHooks)

canvas.render(view)

