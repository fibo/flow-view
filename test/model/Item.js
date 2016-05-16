var test = require('tape')

var Item = require('flow-view').model.Item

test('Model Item', (t) => {
  var item = new Item()

  t.ok(item.id, 'has an id')

  t.end()
})

