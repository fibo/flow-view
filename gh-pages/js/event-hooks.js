
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
  afterMoveNode: function (eventData) {
    console.log('moveNode', eventData)
  },
  beforeAddLink: function (eventData) {
    console.log('addLink', eventData)
  },
  beforeAddNode: function (eventData) {
    console.log('addNode', eventData)
  },
  beforeAddInput: function (eventData) {
    console.log('addInput', eventData)
  },
  beforeAddOutput: function (eventData) {
    console.log('addOutput', eventData)
  },
  beforeDelLink: function (eventData) {
    console.log('delLink', eventData)
  },
  beforeDelNode: function (eventData) {
    console.log('delNode', eventData)
  }
}

var canvas = new Canvas('drawing', { eventHooks: eventHooks })

canvas.render(view)

