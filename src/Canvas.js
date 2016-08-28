import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import FlowView from './containers/FlowView'
import emptyView from './util/emptyView'
import reducers from './reducers'
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

    // TODO selectedItems, previousDraggingPoint, draggedLinkId, etc.
    // should be in components/Canvas state, not in emptyView.
    // Other attrivutes like pinRadius, fontWidth, nodeHeight should
    // be in defaultTheme or even better in components/Canvas defaultProps.

    let store = createStore(
      reducers,
      {
        view: Object.assign(
          {
            height: emptyView.height,
            width: emptyView.width,
            node: emptyView.node,
            link: emptyView.link,
            selectedItems: emptyView.selectedItems,
            isDraggingItems: emptyView.isDraggingItems,
            previousDraggingPoint: emptyView.previousDraggingPoint,
            nodeSelector: emptyView.nodeSelector,
            draggedLinkId: emptyView.draggedLinkId,
            pinRadius: emptyView.pinRadius,
            nodeHeight: emptyView.nodeHeight,
            fontWidth: emptyView.fontWidth
          },
          {
            node: view.node,
            link: view.link,
            height: view.height,
            width: view.width
          }
        )
      },
      window.devToolsExtension && window.devToolsExtension()
    )

    render(
      <Provider store={store}>
        <FlowView documentElement={documentElement} />
      </Provider>,
      documentElement
    )
  }
}

export default Canvas
