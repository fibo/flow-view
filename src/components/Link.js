// @flow
import React from 'react'

import bindme from 'bindme'

import { defaultTheme } from './theme'

import type {
  Id,
  NodeIdAndPosition,
  Theme
} from './types'

type Props = {
  createLink: ({ from: NodeIdAndPosition, to?: NodeIdAndPosition }) => Id,
  deleteLink: (string) => void,
  id: string,
  from: NodeIdAndPosition,
  startDraggingLinkTarget: (Id) => void,
  selected: boolean,
  selectLink: (MouseEvent) => void,
  sourceSelected: boolean,
  targetSelected: boolean,
  theme: Theme,
  to: NodeIdAndPosition,
  x1: number,
  y1: number,
  x2: number,
  y2: number
}

export default class Link extends React.Component<Props> {
  static defaultProps = {
    createLink: Function.prototype,
    deleteLink: Function.prototype,
    startDraggingLinkTarget: Function.prototype,
    selected: false,
    selectLink: Function.prototype,
    sourceSelected: false,
    targetSelected: false,
    theme: defaultTheme
  }

  constructor () {
    bindme(super(),
      'onClick',
      'onDoubleClick',
      'onPathMouseDown',
      'onSourceMouseDown',
      'onTargetMouseDown'
    )
  }

  onClick (event: MouseEvent): void { event.stopPropagation() }

  onDoubleClick (event: MouseEvent): void { event.stopPropagation() }

  onPathMouseDown (event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()

    const {
      id,
      deleteLink,
      selected
    } = this.props

    if (selected) deleteLink(id)
  }

  onSourceMouseDown (event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()

    const {
      from,
      createLink
    } = this.props

    createLink({ from })
  }

  onTargetMouseDown (event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()

    const {
      id,
      startDraggingLinkTarget
    } = this.props

    startDraggingLinkTarget(id)
  }

  render () {
    const {
      selected,
      selectLink,
      sourceSelected,
      targetSelected,
      theme,
      to,
      x1,
      y1,
      x2,
      y2
    } = this.props

    const highlightColor = theme.frame.color.highlight
    const primaryColor = theme.frame.color.primary

    const baseColor = theme.link.color
    const linkWidth = theme.link.width
    const pinSize = theme.node.pin.size

    const startX = x1 + (pinSize / 2)
    const startY = y1 + (pinSize / 2)
    const endX = x2 + (pinSize / 2)
    const endY = y2 + (pinSize / 2)

    const midPointY = (startY + endY) / 2

    const controlPointX1 = startX
    const controlPointY1 = to ? midPointY : startY
    const controlPointX2 = endX
    const controlPointY2 = to ? midPointY : endY

    return (
      <g
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
      >
        <path
          d={startY <= endY ? `M ${startX} ${startY} C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2} ,${endX} ${endY}` : `M ${startX} ${startY} L ${endX} ${endY}`}
          fill='transparent'
          onMouseDown={this.onPathMouseDown}
          onMouseUp={selectLink}
          stroke={selected ? primaryColor : baseColor}
          strokeWidth={linkWidth}
        />
        <rect
          fill={(selected || sourceSelected) ? highlightColor : baseColor}
          height={pinSize}
          onMouseDown={this.onSourceMouseDown}
          width={pinSize}
          x={x1}
          y={y1}
        />
        {to ? (
          <rect
            fill={(selected || targetSelected) ? highlightColor : baseColor}
            height={pinSize}
            onMouseDown={this.onTargetMouseDown}
            width={pinSize}
            x={x2}
            y={y2}
          />
        ) : null}
      </g>
    )
  }
}
