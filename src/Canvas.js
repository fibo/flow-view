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
  }

  /**
   * Mount canvas on a DOM element and render its view,
   * that is a collection of nodes and links.
   */

  load (container: Element, view: FlowView): void {
    const { opt } = this

    const border = opt.theme.border

    // Get height and width from container.
    const rect = container.getBoundingClientRect()

    const height = view.height || rect.height - (2 * border.height)
    const width = view.width || rect.width - (2 * border.width)

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
        view={view}
      />, container)
  }

  resize ({ width, height }: Area): void {
    this.frame.setState({ width, height })
  }

  /**
   * Render to SVG. Can be used for server side rendering.
   */

  toSVG (view: FlowView, callback: func): void {
    const { opt } = this

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
