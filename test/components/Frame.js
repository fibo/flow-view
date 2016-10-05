import dom from 'cheerio'
import React from 'react'
import reactDom from 'react-dom/server'
import Frame from 'components/Frame'
import test from 'tape'

const render = reactDom.renderToStaticMarkup

test('Frame component', (t) => {
  const height = 100
  const width = 100

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

  t.equal($('svg').attr('width'), width.toString(), 'width prop')
  t.equal($('svg').attr('height'), height.toString(), 'height prop')

  t.end()
})
