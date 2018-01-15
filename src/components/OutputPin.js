import React from 'react'

import bindme from 'bindme'

import Pin from './Pin'

import type { Props as PinProps } from './Pin'

export type Props = PinProps & {
  createLink: (SemiLink, ?LinkId) => void
}

export default class OutputPin extends React.Component<Props> {
  static defaultProps = {
    createLink: Function.prototype
  }

  constructor () {
    bindme(super(), 'onMouseDown')
  }

  onMouseDown (event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()

    const {
      createLink,
      nodeIdAndPinPosition
    } = this.props

    createLink({ from: nodeIdAndPinPosition })
  }

  render () {
    return (
      <Pin
        {...this.props}
        onMouseDown={this.onMouseDown}
      />
    )
  }

  shouldComponentUpdate (nextProps: Props): boolean {
    const {
      color,
      x,
      y
    } = this.props

    const colorChanged = color !== nextProps.color
    const positionChanged = (x !== nextProps.x) || (y !== nextProps.y)

    return colorChanged || positionChanged
  }
}
