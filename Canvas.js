import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/App'
import initialState from './util/initialState'
import reducers from './reducers'
import staticProps from 'static-props'

class Canvas {
  constructor (elementId) {
    // Nothing to do in the constructor if we are not in browser context.
    if (typeof document === 'undefined') return

    if (typeof elementId !== 'string') {
      throw new TypeError('elementId must be a string', elementId)
    }

    // Create element and append it to body if it does not exist already.
    let element = document.getElementById(elementId)

    if (element === null) {
      element = document.createElement('div')
      element.id = elementId
      document.body.appendChild(element)
    }

    staticProps(this)({ element })
  }

  render (view) {
    const element = this.element

    const offset = {
      x: element.offsetLeft,
      y: element.offsetTop
    }

    let store = createStore(
      reducers,
      Object.assign(initialState, view),
      window.devToolsExtension && window.devToolsExtension()
    )

    render(
      <Provider store={store}>
        <App offset={offset} />
      </Provider>,
      element
    )
  }
}

export default Canvas
