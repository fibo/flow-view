// @flow
// TODO Element is required by flow, but it is not imported, it seems
//      to be a builtin. By now I make it global, it makes linter happy.
/* global Element */
import React from 'react'

import ReactDOM from 'react-dom'
// It is not a bad idea to include react-dom/server in the bundle.
// It is only 620 bytes, see https://gist.github.com/irae/2026a9655ca5ee8cd9e821c63435de1e
import reactDOMServer from 'react-dom/server'
import EventEmitter from 'events'

import bindme from 'bindme'
import mergeOptions from 'merge-options'
import svgx from 'svgx'

import FlowViewFrame from './components/Frame'
import type { Props as FramePropType } from './components/Frame'

import type {
  FlowView,
  Id,
  NodeIdAndPosition,
  SerializedLink,
  SerializedNode,
  SerializedPin
} from './components/types'

const defaultOpt = FlowViewFrame.defaultProps.opt
const defaultView = FlowViewFrame.defaultProps.view

export default class FlowViewCanvas extends EventEmitter {
  container: ?Element
  opt: FramePropType.opt
  view: FlowView

  constructor (container: Element | string, opt: FramePropType.opt) {
    bindme(super(),
      'emitCreateInputPin',
      'emitCreateLink',
      'emitCreateNode',
      'emitCreateOutputPin',
      'emitDeleteInputPin',
      'emitDeleteOutputPin',
      'emitDeleteLink',
      'emitDeleteNode',
      'emitDeleteOutputPin',
      'emitUpdateNodesGeometry'
    )

    // Merge options

    this.opt = mergeOptions(defaultOpt, opt)

    let containerElement
    let containerNotFound = false

    // If we are in browser context, get the document element containing
    // the canvas or create it.
    //
    // Cannot use `if (document)` or `if(no(document))` otherwise
    // test/serverside/works.js will fail.
    if (typeof document !== 'undefined') {
      // Check if container is a String.
      if (typeof container === 'string') {
        containerElement = document.getElementById(container)

        if (document.body && document.body.contains(containerElement)) {
          this.container = containerElement
        } else {
          containerNotFound = true
        }
      // Check if container is an HTMLElement.
      } else {
        if (container && document.body && document.body.contains(container)) {
          this.container = container
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

  emitCreateInputPin (
    nodeIdAndPosition: NodeIdAndPosition,
    pin: SerializedPin
  ): void {
    this.emit('createInputPin', nodeIdAndPosition, pin)
  }

  emitCreateLink (link: SerializedLink, id: Id): void {
    this.emit('createLink', link, id)
  }

  emitCreateNode (node: SerializedNode, id: Id): void {
    this.emit('createNode', node, id)
  }

  emitCreateOutputPin (
    nodeIdAndPosition: NodeIdAndPosition,
    pin: SerializedPin
  ): void {
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

  emitUpdateNodesGeometry (nodes: Array<SerializedNode>): void {
    this.emit('updateNodesGeometry', nodes)
  }

  /**
   * Render to SVG.
   *
   * @param {Object} view
   * @param {Object} [model]
   * @param {Function} [callback] run server side
   */

  render (initialView: FlowView, model: {}, callback?: Function): void {
    const container = this.container
    const opt = this.opt

    let height
    let width

     // Get height and width from container, if any.
    if (container) {
      var border = 1 // TODO could be configurable in opt theme
      var rect = container.getBoundingClientRect()

      height = rect.height - (2 * border)
      width = rect.width - (2 * border)
    }

    const view = mergeOptions(defaultView, initialView, { width, height })

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
          emitUpdateNodesGeometry={this.emitUpdateNodesGeometry}
          opt={opt}
          model={model}
          view={view}
        />, container)
    } else {
       // Server side rendering.

      const svgxOpts = { doctype: true, xmlns: true }

      var jsx = (
        <FlowViewFrame responsive
          opt={opt}
          view={view}
         />
       )

      var outputSVG = svgx(reactDOMServer.renderToStaticMarkup)(jsx, svgxOpts)

      if (typeof callback === 'function') {
        callback(null, outputSVG)
      }
    }
  }
}
