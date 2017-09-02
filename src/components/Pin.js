import React from 'react'

import bindme from 'bindme'

import {
  Color,
  Id,
  NodeIdAndPosition,
  Point
} from './types'

export default class Pin extends React.PureComponent {
  props: Point & {
    color: Color,
    createLink: ?({ from: NodeIdAndPosition, to?: NodeIdAndPosition }) => Id,
    nodeIdAndPosition: NodeIdAndPosition,
    size: number
  }

  static defaultProps = {
    onMouseDown: Function.prototype,
    onMouseUp: Function.prototype
  }

  constructor () {
    bindme(super(),
      'onMouseDown',
      'onMouseUp'
    )
  }

  onMouseDown () { /* to be overridden */ }

  onMouseUp () { /* to be overridden */ }

  render () {
    const {
      color,
      size,
      x,
      y
    } = this.props

    return (
      <rect
        fill={color}
        height={size}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        transform={`translate(${x},${y})`}
        width={size}
      />
    )
  }
}
