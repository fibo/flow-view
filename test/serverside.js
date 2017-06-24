var test = require('tape')

var Canvas = require('flow-view').Canvas

test('Server side Canvas', (t) => {
  var canvas = new Canvas('drawing')

  t.equal(null, canvas.container, 'container')

  t.end()
})
