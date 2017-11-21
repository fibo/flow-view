import React from 'react'

import ReactDOM from 'react-dom'
// It is not a bad idea to include react-dom/server in the bundle.
// It is only 620 bytes, see https://gist.github.com/irae/2026a9655ca5ee8cd9e821c63435de1e
import reactDOMServer from 'react-dom/server'
import EventEmitter from 'events'

import bindme from 'bindme'
import no from 'not-defined'
import svgx from 'svgx'

import FlowViewFrame from './components/Frame'

import {
  FlowView,
  Id,
  NodeIdAndPosition,
  Pin,
  SerializedLink,
  SerializedNode
} from './components/types'

const defaultItem = FlowViewFrame.defaultProps.item

export default class FlowViewCanvas extends EventEmitter {
  constructor (container, item) {
    bindme(super(),
      'emitCreateInputPin',
      'emitCreateLink',
      'emitCreateNode',
      'emitCreateOutputPin',
      'emitDeleteInputPin',
      'emitDeleteOutputPin',
      'emitDeleteLink',
      'emitDeleteNode',
      'emitDeleteOutputPin'
    )

    this.view = FlowViewFrame.defaultProps.view

    if (no(item)) item = defaultItem
    if (no(item.node)) item.node = defaultItem.node
    if (no(item.node.DefaultNode)) item.node.DefaultNode = defaultItem.node.DefaultNode
    if (no(item.nodeList)) item.nodeList = defaultItem.nodeList
    if (no(item.util)) item.util = defaultItem.util

    this.item = item

    let containerElement
    let containerNotFound = false

    // If we are in browser context, get the document element containing
    // the canvas or create it.
    //
    // Cannot use `if (document)` or `if(no(document))` otherwise
    // test/serverside/works.js will fail.
    if (typeof document === 'undefined') {
      // Check if container is a String.
      if (typeof container === 'string') {
        containerElement = document.getElementById(container)
        console.log(containerElement)

        if (no(containerElement)) {
          containerNotFound = true
        } else {
          this.container = containerElement
        }
      // Check if container is an HTMLElement.
      } else {
        if (document.body.contains(container)) {
          this.container = containerElement
        } else {
          containerNotFound = true
        }
      }

      if (containerNotFound) {
        throw new TypeError('container must be a String or an HTMLElement')
      }
    } else {
      this.container = null
    }
  }

  emitCreateInputPin (nodeIdAndPosition: NodeIdAndPosition, pin: Pin): void {
    this.emit('createInputPin', nodeIdAndPosition, pin)
  }

  emitCreateLink (link: SerializedLink, id: Id): void {
    this.emit('createLink', link, id)
  }

  emitCreateNode (node: SerializedNode, id: Id): void {
    this.emit('createNode', node, id)
  }

  emitCreateOutputPin (nodeIdAndPosition: NodeIdAndPosition, pin: Pin): void {
    this.emit('createOutputPin', nodeIdAndPosition, pin)
  }

  emitDeleteInputPin (nodeIdAndPosition: NodeIdAndPosition): void {
    this.emit('deleteInputPin', nodeIdAndPosition)
  }

  emitDeleteLink (id: Id): void {
    this.emit('deleteLink', id)
  }

  emitDeleteNode (id: Id): void {
    this.emit('deleteNode', id)
  }

  emitDeleteOutputPin (nodeIdAndPosition: NodeIdAndPosition): void {
    this.emit('deleteOutputPin', nodeIdAndPosition)
  }

  getView (): FlowView {
    return Object.assign({}, this.view)
  }

  /**
   * Render to SVG.
   *
   * @param {Object} view
   * @param {Object} [model]
   * @param {Function} [callback] run server side
   */

  render (view: FlowView, model, callback): void {
    const container = this.container
    const item = this.item

    let height
    let width

     // Get height and width from container, if any.
    if (container) {
      var border = 1 // TODO could be configurable in style prop
      var rect = container.getBoundingClientRect()

      height = rect.height - (2 * border)
      width = rect.width - (2 * border)
    }

    if (no(view)) view = {}
    if (no(view.height)) view.height = height
    if (no(view.link)) view.link = {}
    if (no(view.node)) view.node = {}
    if (no(view.width)) view.width = width

    if (container) {
      // Client side rendering.

      // If no component is mounted in the container,
      // calling this function does nothing. It removes
      // the mounted React component from the DOM and
      // cleans up its event handlers and state.
      ReactDOM.unmountComponentAtNode(container)

      ReactDOM.render(
        <FlowViewFrame
          emitCreateInputPin={this.emitCreateInputPin}
          emitCreateLink={this.emitCreateLink}
          emitCreateNode={this.emitCreateNode}
          emitCreateOutputPin={this.emitCreateOutputPin}
          emitDeleteInputPin={this.emitDeleteInputPin}
          emitDeleteLink={this.emitDeleteLink}
          emitDeleteNode={this.emitDeleteNode}
          emitDeleteOutputPin={this.emitDeleteOutputPin}
          item={item}
          model={model}
          nodeList={item.nodeList}
          view={view}
        />, container)
    } else {
       // Server side rendering.

      var opts = { doctype: true, xmlns: true }

      var jsx = (
        <FlowViewFrame responsive
          item={item}
          view={view}
         />
       )

      var outputSVG = svgx(reactDOMServer.renderToStaticMarkup)(jsx, opts)

      if (typeof callback === 'function') {
        callback(null, outputSVG)
      }
    }
  }
}
