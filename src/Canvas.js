import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import reducers from './reducers'

let store = createStore(reducers)

class Canvas {
  constructor (elementId) {
    if (typeof elementId !== 'string') {
      throw new TypeError('elementId must be a string', elementId)
    }

    this.elementId = elementId

    // Create element and append it to body if it does not exist already.
    let element = document.getElementById(elementId)

    if (element === null) {
      element = document.createElement('div')
      element.id = elementId
      document.body.appendChild(element)
    }
  }

  render (view) {
    const element = document.getElementById(this.elementId)

    render(
      <Provider store={store}>
        <App {...view} />
      </Provider>,
      element
    )
  }
}

export default Canvas
