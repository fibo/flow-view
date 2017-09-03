// @flow
import React from 'react'

import bindme from 'bindme'

import type {
  Color,
  NodeIdAndPosition,
  Point
} from './types'

export type Props = Point & {
  color: Color,
  nodeIdAndPosition: NodeIdAndPosition,
  size: number
}

export default class Pin extends React.Component<Props> {
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

  onMouseDown (event: MouseEvent): void { /* to be overridden */ }

  onMouseUp (event: MouseEvent): void { /* to be overridden */ }

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
