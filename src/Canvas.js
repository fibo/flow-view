import React from 'react'
import { render } from 'react-dom'
import Canvas from './components/Canvas'

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

    render(
      <Canvas view={view} />,
      container
    )
  }
}

export default FlowViewCanvas
