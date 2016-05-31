import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/App'
import initialState from './initialState'
import reducers from './reducers'
import staticProps from 'static-props'

class Canvas {
  constructor (elementId) {
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

    staticProps(this)({
      element
    })
  }

  render (view) {
    const element = this.element

    let store = createStore(
      reducers,
      Object.assign(initialState, view),
      window.devToolsExtension && window.devToolsExtension()
    )

    render(
      <Provider store={store}>
        <App />
      </Provider>,
      element
    )
  }
}

export default Canvas
