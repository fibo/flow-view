var test = require('tape')

var Node = require('flow-view').model.Node

test('Model Node', (t) => {
  var data = {
    ins: [],
    outs: [],
    text: 'new node'
  }

  var node = new Node(data)

  t.deepEqual(node.getData(), data, 'getData()')

  t.end()
})
