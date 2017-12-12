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
import staticProps from 'static-props'
import svgx from 'svgx'

import FlowViewFrame from './components/Frame'
import type { Props as FramePropType } from './components/Frame'

import type {
  Area,
  FlowView,
  LinkId,
  NodeId,
  NodeIdAndPinPosition
  SerializedLink,
  SerializedNode,
  SerializedPin
} from './components/types'

const defaultOpt = FlowViewFrame.defaultProps.opt
const defaultView = FlowViewFrame.defaultProps.view

export default class FlowViewCanvas extends EventEmitter {
  opt: FramePropType.opt

  constructor (opt: FramePropType.opt) {
    bindme(super(), 'emit')

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

  /**
   * Load view.
   *
   * @param {Object} view
   * @param {Function} [callback] run server side
   */

  load (initialView: FlowView, callback?: Function): void {
    const container = this.container
    const opt = this.opt

    const border = opt.theme.border

    let height
    let width

     // Get height and width from container, if any.
    if (container) {
      let rect = container.getBoundingClientRect()

      height = rect.height - (2 * border.height)
      width = rect.width - (2 * border.width)
    }

    const view = mergeOptions(defaultView, initialView, { width, height })

    if (container) {
      // Client side rendering.

    }
  }

  /**
   * Mount on DOM element.
   *
   * @param {Object} view
   * @param {Function} callback
   */

  mountOn (container): void {
    // If no component is mounted in the container,
    // calling this function does nothing. It removes
    // the mounted React component from the DOM and
    // cleans up its event handlers and state.
    ReactDOM.unmountComponentAtNode(container)

    ReactDOM.render(
      <FlowViewFrame
        ref={frame => { staticProps(this)({ frame }) }}
        emit={this.emit}
        opt={opt}
        model={model}
        view={view}
      />, container)
  }

  resize ({ width, height }: Area): void {
    this.frame.resize({ width, height })
  }

  /**
   * Render to SVG. Can be used for server side rendering.
   */

  toSVG (callback: func): void {
    const { opt, view } = this

    const svgxOpts = { doctype: true, xmlns: true }

    const jsx = (
      <FlowViewFrame responsive
        opt={opt}
        view={view}
       />
     )

    const SVG = svgx(reactDOMServer.renderToStaticMarkup)(jsx, svgxOpts)

    callback(null, SVG)
  }
}
