var test = require('tape')

import Canvas from 'abstract/Canvas'

test('Abstract Canvas', (t) => {
  const canvas = new Canvas()

  t.ok(canvas)
})
