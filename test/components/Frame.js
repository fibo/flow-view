import dom from 'cheerio'
import React from 'react'
import reactDom from 'react-dom/server'
import Frame from 'components/Frame'
import test from 'tape'

var render = reactDom.renderToStaticMarkup

test('Frame component', (t) => {
  var height = 100
  var width = 100

  var border = 1
  var expectedHeight = height - (2 * border)
  var expectedWidth = width - (2 * border)

  var view = {
    height,
    link: {},
    node: {},
    width
  }

  var el = (
    <Frame
      view={view}
    />
  )

  var $ = dom.load(render(el), { xmlMode: true })

  t.equal($('svg').attr('width'), expectedWidth.toString(), 'width prop')
  t.equal($('svg').attr('height'), expectedHeight.toString(), 'height prop')

  t.end()
})
