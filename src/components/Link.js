// @flow
import React from 'react'

import bindme from 'bindme'

import ignoreEvent from '../utils/ignoreEvent'
import { defaultTheme, Theme } from './theme'
import {
  Id,
  NodeIdAndPosition
} from './types'

export default class Link extends React.PureComponent {
  props: {
    createLink: ({ from: NodeIdAndPosition, to?: NodeIdAndPosition }) => Id,
    deleteLink: (string) => void,
    id: string,
    from: NodeIdAndPosition,
    startDraggingLinkTarget: (Id) => void,
    pinSize: number,
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
      'onPathMouseDown',
      'onSourceMouseDown',
      'onTargetMouseDown'
    )
  }

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

    const {
      darkPrimaryColor,
      primaryColor,
      linkColor,
      lineWidth,
      pinSize
    } = theme

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
        onClick={ignoreEvent}
        onDoubleClick={ignoreEvent}
      >
        <path
          d={startY <= endY ? `M ${startX} ${startY} C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2} ,${endX} ${endY}` : `M ${startX} ${startY} L ${endX} ${endY}`}
          fill='transparent'
          onMouseDown={this.onPathMouseDown}
          onMouseUp={selectLink}
          stroke={selected ? primaryColor : linkColor}
          strokeWidth={lineWidth}
        />
        <rect
          fill={(selected || sourceSelected) ? darkPrimaryColor : linkColor}
          height={pinSize}
          onMouseDown={this.onSourceMouseDown}
          width={pinSize}
          x={x1}
          y={y1}
        />
        {to ? (
          <rect
            fill={(selected || targetSelected) ? darkPrimaryColor : linkColor}
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
