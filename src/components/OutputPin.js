import React from 'react'

import bindme from 'bindme'

import Pin from './Pin'

export type Props = Point & {
  color: Color,
  createLink: (SemiLink) => LinkId,
  nodeIdAndPinPosition: NodeIdAndPinPosition,
  onMouseDown?: (MouseEvent) => void,
  onMouseUp?: (MouseEvent) => void,
  size: number
}

export default class OutputPin extends React.Component<Props> {
  static defaultProps = {
    createLink: (semiLink: SemiLink) => ('id'),
    onMouseDown: (event: MouseEvent) => {},
    onMouseUp: (event: MouseEvent) => {}
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
