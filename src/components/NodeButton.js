import React from 'react'

import bindme from 'bindme'

export default class NodeButton extends React.Component {
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

    const ray = size / 2

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
          cx={x + ray}
          cy={y + ray}
          fill='transparent'
          stroke={(focus && !disabled) ? color : 'transparent'}
          r={ray}
        />
      </g>
    )
  }
}
