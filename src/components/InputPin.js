import React from 'react'

import bindme from 'bindme'

import Pin from './Pin'

export type Props = Point & {
  color: Color,
  connectLinkToTarget: (LinkId, NodeIdAndPinPosition) => void,
  draggedLinkId: ?LinkId,
  nodeIdAndPinPosition: NodeIdAndPinPosition,
  onMouseDown?: (MouseEvent) => void,
  onMouseUp?: (MouseEvent) => void,
  size: number
}

export default class InputPin extends React.Component<Props> {
  static defaultProps = {
    connectLinkToTarget: (linkId: LinkId, nodeIdAndPinPosition: NodeIdAndPinPosition) => {},
    draggedLinkId: null,
    onMouseDown: (event: MouseEvent) => {},
    onMouseUp: (event: MouseEvent) => {}
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
