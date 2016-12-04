import React, { Component, PropTypes } from 'react'
import ignoreEvent from '../utils/ignoreEvent'
import defaultTheme from './theme'

class Link extends Component {
  render () {
    const {
      id,
      fill,
      from,
      onCreateLink,
      startDraggingLinkTarget,
      pinSize,
      selected,
      selectLink,
      to,
      width,
      x1,
      y1,
      x2,
      y2
    } = this.props

    const onSourceMouseDown = (e) => {
      e.preventDefault()
      e.stopPropagation()

      onCreateLink({ from, to: null })
    }

    const onTargetMouseDown = (e) => {
      e.preventDefault()
      e.stopPropagation()

      startDraggingLinkTarget(id)
    }

    const startX = x1 + pinSize / 2
    const startY = y1 + pinSize / 2
    const endX = x2 + pinSize / 2
    const endY = y2 + pinSize / 2

    const midPointY = (startY + endY) / 2
    const verticalDistance = (endY - startY) / 2

    const controlPointX1 = startX
    const controlPointY1 = verticalDistance > 0 ? midPointY : startY - verticalDistance * 2
    const controlPointX2 = endX
    const controlPointY2 = verticalDistance > 0 ? midPointY : endY + verticalDistance * 2

    return (
      <g
        onClick={ignoreEvent}
        onDoubleClick={ignoreEvent}
      >
        <path
          d={`M ${startX} ${startY} C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2} ,${endX} ${endY}`}
          fill='transparent'
          onMouseUp={selectLink}
          stroke={selected ? defaultTheme.highlightColor : fill}
          strokeWidth={width}
        />
        <rect
          fill={fill}
          height={pinSize}
          onMouseDown={onSourceMouseDown}
          width={pinSize}
          x={x1}
          y={y1}
        />
        {to ? (
          <rect
            fill={fill}
            height={pinSize}
            onMouseDown={onTargetMouseDown}
            width={pinSize}
            x={x2}
            y={y2}
          />
        ) : null}
      </g>
    )
  }
}

Link.propTypes = {
  id: PropTypes.string,
  fill: PropTypes.string.isRequired,
  from: PropTypes.array,
  onCreateLink: PropTypes.func.isRequired,
  startDraggingLinkTarget: PropTypes.func.isRequired,
  pinSize: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  selectLink: PropTypes.func.isRequired,
  to: PropTypes.array,
  width: PropTypes.number.isRequired,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired
}

Link.defaultProps = {
  fill: 'gray',
  onCreateLink: Function.prototype,
  startDraggingLinkTarget: Function.prototype,
  pinSize: defaultTheme.pinSize,
  selected: false,
  selectLink: Function.prototype,
  width: defaultTheme.lineWidth
}

export default Link
