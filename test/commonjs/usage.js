var Canvas = require('flow-view').Canvas
var test = require('tape')

test('Server side Canvas', (t) => {
  var canvas = new Canvas('drawing')

  t.equal(typeof canvas, 'object', 'canvas is an object')

  t.end()
})
