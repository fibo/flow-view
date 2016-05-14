var test = require('tape')

var Item = require('model/Item')

test('Abstract Item', (t) => {
  var item = new Item()

  t.ok(item.id, 'has an id')

  t.end()
})

