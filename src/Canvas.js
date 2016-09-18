import React from 'react'
import { render } from 'react-dom'
import Canvas from './components/Canvas'
import randomString from './utils/randomString'

// TODO find a better way to generate ids.
const idLength = 3

class FlowViewCanvas {
  constructor (containerId) {
    this.container = null

    // Check that containerId is a string.
    if (typeof containerId !== 'string') {
      throw new TypeError('containerId must be a string', containerId)
    }

    // If we are in browser context, get the document element containing
    // the canvas or create it.
    if (typeof document !== 'undefined') {
      var container = document.getElementById(containerId)

      if (container === null) {
        container = document.createElement('div')
        container.id = containerId
        document.body.appendChild(container)
      }

      this.container = container
    }
  }

  render (view) {
    const container = this.container

    const createLink = (link) => {
      function generateId () {
        const id = randomString(idLength)
        return link[id] ? generateId() : id
      }

      const id = generateId()

      view.link[id] = link
    }

    const createNode = (node) => {
      function generateId () {
        const id = randomString(idLength)
        return node[id] ? generateId() : id
      }

      const id = generateId()

      view.node[id] = node
    }

    const dragItems = (dragginDelta, selectItems) => {
      Object.keys(view.node)
            .filter((id) => (selectItems.includes(id)))
            .forEach((id) => {
              view.node[id].x += dragginDelta.x
              view.node[id].y += dragginDelta.y
            })

      // TODO drag links
    }

    const component = (
      <Canvas
        createLink={createLink}
        createNode={createNode}
        dragItems={dragItems}
        view={view}
      />
    )

    if (container) {
      // Client side rendering.
      render(component, container)
    } else {
      // Server side rendering.

      // TODO
      // const canvas = new Canvas(view)
      // const jsx = canvas.render()
      // const svgOutput = renderSVGx(jsx)
      // console.log(svgOutput)
    }
  }
}

export default FlowViewCanvas
