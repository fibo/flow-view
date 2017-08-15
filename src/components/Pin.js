import React from 'react'

import {
  Color,
  Point
} from './types'

export default class Pin extends React.Component {
  props: Point & {
    color: Color,
    size: number
  }

  render () {
    const {
      color,
      size,
      x,
      y
    } = this.props

    return (
      <rect>
        fill={color}
        height={size}
        transform={`translate(${x},${y})`}
        width={size}
      </rect>
    )
  }
}
