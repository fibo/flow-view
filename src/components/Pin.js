import React from 'react'

export type Props = Point & {
  color: Color,
  nodeIdAndPinPosition: NodeIdAndPinPosition,
  onMouseDown?: (MouseEvent) => void,
  onMouseUp?: (MouseEvent) => void,
  size: number
}

export default class Pin extends React.Component<Props> {
  render () {
    const {
      color,
      onMouseDown,
      onMouseUp,
      size,
      x,
      y
    } = this.props

    return (
      <rect
        fill={color}
        height={size}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        transform={`translate(${x},${y})`}
        width={size}
      />
    )
  }
}
