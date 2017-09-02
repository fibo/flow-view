import React from 'react'

import bindme from 'bindme'

import { Point } from './types'

export default class NodeButton extends React.PureComponent {
  props: Point & {
    action: () => void,
    color: string,
    disabled: boolean,
    size: number
  }

  static defaultProps = {
    disabled: false
  }

  constructor () {
    bindme(super(),
      'onMouseDown',
      'onMouseEnter',
      'onMouseLeave'
    )

    this.state = { focus: false }
  }

  onMouseEnter () {
    this.setState({ focus: true })
  }

  onMouseLeave () {
    this.setState({ focus: false })
  }

  onMouseDown () {
    const {
      action,
      disabled
    } = this.props

    if (!disabled) action()
  }

  render () {
    const {
      color,
      disabled,
      size,
      x,
      y
    } = this.props

    const { focus } = this.state

    return (
      <g
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <path
          d={this.shape(size)}
          fill={disabled ? 'transparent' : color}
          onMouseDown={this.onMouseDown}
          stroke={color}
          transform={`translate(${x},${y})`}
        />
        <circle
          cx={x + (size / 2)}
          cy={y + (size / 2)}
          fill='transparent'
          stroke={(focus && !disabled) ? color : 'transparent'}
          r={this.ray()}
        />
      </g>
    )
  }
}
