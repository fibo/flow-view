var test = require('tape')

var Canvas = require('model/Canvas')

test('Abstract Canvas', (t) => {
  var canvas = new Canvas()

  t.deepEqual(canvas.link, {}, 'link defaults to {}')
  t.deepEqual(canvas.node, {}, 'node defaults to {}')

  t.end()
})
