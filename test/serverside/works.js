var Canvas = require('flow-view').Canvas
var test = require('tape')

test('Server side Canvas', (t) => {
  var containerId = 'drawing'
  var canvas = new Canvas(containerId)

  t.equal(containerId, canvas.containerId, 'containerId')
  t.equal(null, canvas.container, 'container')

  t.end()
})
