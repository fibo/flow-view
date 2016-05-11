var test = require('tape')

import Canvas from 'abstract/Canvas'

test('Abstract Canvas', (t) => {
  let canvas = new Canvas()

  t.deepEqual(canvas.link, {}, 'link defaults to {}')
  t.deepEqual(canvas.node, {}, 'node defaults to {}')

  t.end()
})
