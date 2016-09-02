import React from 'react'
import { render } from 'react-dom'
// import emptyView from './utils/emptyView'
import staticProps from 'static-props'

class Canvas {
  constructor (documentElementId) {
    let documentElement = null

    // Check that documentElementId is a string.
    if (typeof documentElementId !== 'string') {
      throw new TypeError('documentElementId must be a string', documentElementId)
    }

    // If we are in browser context, get the documentElement or create it.
    if (typeof document !== 'undefined') {
      documentElement = document.getElementById(documentElementId)

      if (documentElement === null) {
        documentElement = document.createElement('div')
        documentElement.id = documentElementId
        document.body.appendChild(documentElement)
      }
    }

    staticProps(this)({ documentElement })
  }

  render (view) {
    const documentElement = this.documentElement

    render(
      <Canvas documentElement={documentElement} />,
      documentElement
    )
  }
}

export default Canvas
