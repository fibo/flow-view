import React from 'react'

import bindme from 'bindme'

import type {
  Color,
  Id,
  NodeIdAndPosition,
  Point
} from './types'

type Props = Point & {
  color: Color,
  nodeIdAndPosition: NodeIdAndPosition,
  size: number
}

export default class Pin extends React.PureComponent<Props> {
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
