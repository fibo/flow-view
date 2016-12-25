import React, { Component, PropTypes } from 'react'
import ignoreEvent from '../utils/ignoreEvent'
import theme from './theme'

class Link extends Component {
  render () {
    const {
      id,
      from,
      onCreateLink,
      startDraggingLinkTarget,
      selected,
      selectLink,
      theme,
      to,
      x1,
      y1,
      x2,
      y2
    } = this.props

    const {
      highlightColor,
      linkColor,
      lineWidth,
      pinSize
    } = theme

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
          d={`M ${startX} ${startY} C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2} ,${endX} ${endY}`}
          fill='transparent'
          onMouseUp={selectLink}
          stroke={selected ? highlightColor : linkColor}
          strokeWidth={lineWidth}
        />
        <rect
          fill={linkColor}
          height={pinSize}
          onMouseDown={onSourceMouseDown}
          width={pinSize}
          x={x1}
          y={y1}
        />
        {to ? (
          <rect
            fill={linkColor}
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
  from: PropTypes.array,
  onCreateLink: PropTypes.func.isRequired,
  startDraggingLinkTarget: PropTypes.func.isRequired,
  pinSize: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  selectLink: PropTypes.func.isRequired,
  theme: theme.propTypes,
  to: PropTypes.array,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired
}

Link.defaultProps = {
  onCreateLink: Function.prototype,
  startDraggingLinkTarget: Function.prototype,
  selected: false,
  selectLink: Function.prototype,
  theme: theme.defaultProps
}

export default Link
