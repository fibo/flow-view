var test = require('tape')

var Canvas = require('model/Canvas')
var Node = require('model/Node')

test('Abstract Node', (t) => {
  var canvas = new Canvas()
  var node = new Node(canvas)

  t.deepEqual(node.ins, [], 'ins defaults to []')
  t.deepEqual(node.outs, [], 'outs defaults to []')

  t.end()
})
