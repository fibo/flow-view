import dom from 'cheerio'
import React from 'react'
import reactDom from 'react-dom/server'
import Frame from 'components/Frame'
import test from 'tape'

const render = reactDom.renderToStaticMarkup

test('Frame component', (t) => {
  const height = 100
  const width = 100

  const border = 1
  const expectedHeight = height - 2 * border
  const expectedWidth = width - 2 * border

  const view = {
    height,
    link: {},
    node: {},
    width
  }

  const el = (
    <Frame
      view={view}
    />
  )

  const $ = dom.load(render(el), { xmlMode: true })

  t.equal($('svg').attr('width'), expectedWidth.toString(), 'width prop')
  t.equal($('svg').attr('height'), expectedHeight.toString(), 'height prop')

  t.end()
})
