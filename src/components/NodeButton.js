import React from 'react'

import bindme from 'bindme'

export type Props = Point & {
  action: () => void,
  color: string,
  disabled: boolean,
  ray: (number) => number,
  shape: (number) => string,
  size: number

}

type State = {
  focus: boolean
}

export default class NodeButton extends React.Component<Props, State> {
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
      ray,
      shape,
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
          d={shape(size)}
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
          r={ray(size)}
        />
      </g>
    )
  }
}
