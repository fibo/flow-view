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

import type { Pros as FlowViewFrameProps } from './components/Frame'

export type Options = {
  getTypeOfNode: FlowViewFrameProps.getTypeOfNode,
  nodeComponent?: FlowViewFrameProps.nodeComponent,
  nodeList?: FlowViewFrameProps.nodeList,
  theme?: Theme
}

const defaultView = FlowViewFrame.defaultProps.view
const defaultOpt = {
  getTypeOfNode: FlowViewFrame.defaultProps.getTypeOfNode,
  nodeComponent: FlowViewFrame.defaultProps.nodeComponent,
  nodeList: FlowViewFrame.defaultProps.nodeList,
  theme: FlowViewFrame.defaultProps.theme
}

export default class FlowViewCanvas extends EventEmitter {
  frame: ?FlowViewFrame
  opt: ?Options
  view: ?FlowView

  constructor (opt: ?Options) {
    bindme(super(), 'emit')

    // Merge options

    this.opt = mergeOptions(opt, defaultOpt)
  }

  load (view: FlowView = defaultView): FlowViewCanvas {
    this.view = view

    return this
  }

  mountOn (container: HTMLElement): void {
    const { opt, view } = this

    // Get height and width from container.

    const rect = container.getBoundingClientRect()

    const { width, height } = rect

    // If no component is mounted in the container,
    // calling this function does nothing. It removes
    // the mounted React component from the DOM and
    // cleans up its event handlers and state.
    ReactDOM.unmountComponentAtNode(container)

    ReactDOM.render(
      <FlowViewFrame
        emit={this.emit}
        height={height}
        opt={opt}
        ref={frame => { this.frame = frame }}
        theme={opt.theme}
        view={view}
        width={width}
      />, container)
  }

  resize ({ width, height }: Area): void {
    this.frame.setState({ width, height })
  }

  toSVG (
    { width, height }: Area,
    callback: (err: ?Error, any) => void
  ): void {
    const { opt, view } = this

    const { theme } = opt

    const svgxOpts = { doctype: true, xmlns: true }

    const jsx = (
      <FlowViewFrame
        height={height}
        opt={opt}
        theme={theme}
        view={view}
        width={width}
       />
     )

    const SVG = svgx(reactDOMServer.renderToStaticMarkup)(jsx, svgxOpts)

    callback(null, SVG)
  }
}
