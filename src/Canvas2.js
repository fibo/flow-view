// TODO rename this class as Canvas when ready
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import Canvas from './components/Canvas'
import reducers from './reducers'

class Canvas2 {
  constructor (elementId) {
    const element = document.getElementById(elementId)

    render(
      <Provider store={store}>
        <Canvas />
      </Provider>,
      element
    )
  }
}

export default Canvas2
