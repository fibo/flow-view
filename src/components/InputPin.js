import React from 'react'

import bindme from 'bindme'

import Pin from './Pin'

import type { Props as PinProps } from './Pin'

export type Props = PinProps & {
  connectLinkToTarget: ConnectLinkToTarget,
  draggedLinkId: ?LinkId
}

export default class InputPin extends React.Component<Props> {
  static defaultProps = {
    connectLinkToTarget: Function.prototype,
    draggedLinkId: null
  }

  constructor () {
    bindme(super(), 'onMouseUp')
  }

  onMouseDown (event: MouseEvent): void { event.stopPropagation() }

  onMouseUp (event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()

    const {
      connectLinkToTarget,
      draggedLinkId,
      nodeIdAndPinPosition
    } = this.props

    if (draggedLinkId) {
      connectLinkToTarget(draggedLinkId, nodeIdAndPinPosition)
    }
  }

  render () {
    return (
      <Pin
        {...this.props}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      />
    )
  }

  shouldComponentUpdate (nextProps: Props): boolean {
    const {
      color,
      draggedLinkId,
      x,
      y
    } = this.props

    const colorChanged = color !== nextProps.color
    const draggedLinkIdChanged = draggedLinkId !== nextProps.draggedLinkId
    const positionChanged = (x !== nextProps.x) || (y !== nextProps.y)

    return colorChanged || draggedLinkIdChanged || positionChanged
  }
}
