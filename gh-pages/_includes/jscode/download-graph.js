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
       text: 'Delete me',
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

var graph = canvas.toJSON()
var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graph))
$('#download').attr('href', data)

var eventNames = [
  'addLink' , 'addNode',
  'addInput', 'addOutput',
  'delLink' , 'delNode',
  'moveNode', 'renameNode'
]

eventNames.forEach(function (eventName) {
  canvas.broker.on(eventName, function (ev) {
    graph = canvas.toJSON()
    data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graph))
    $('#download').attr('href', data)
  })
})

