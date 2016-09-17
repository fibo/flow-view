import React, { PropTypes } from 'react'
import ignoreEvent from '../utils/ignoreEvent'
import defaultTheme from './theme'

const Link = ({
  deleteLink,
  fill,
  pinSize,
  selected,
  selectLink,
  width,
  x1,
  y1,
  x2,
  y2
}) => (
  <g
    onClick={selected ? undefined : selectLink}
    onDoubleClick={selected ? deleteLink : undefined}
    onMouseDown={ignoreEvent}
  >
    <rect
      fill={fill}
      height={pinSize}
      width={pinSize}
      x={x1}
      y={y1}
    />
    <line
      stroke={fill}
      strokeWidth={width}
      x1={x1 + pinSize / 2}
      y1={y1 + pinSize / 2}
      x2={x2 + pinSize / 2}
      y2={y2 + pinSize / 2}
    />
    <rect
      fill={fill}
      height={pinSize}
      width={pinSize}
      x={x2}
      y={y2}
    />
  </g>
)

Link.propTypes = {
  deleteLink: PropTypes.func.isRequired,
  fill: PropTypes.string.isRequired,
  pinSize: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  selectLink: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired
}

Link.defaultProps = {
  deleteLink: Function.prototype,
  fill: 'gray',
  pinSize: defaultTheme.pinSize,
  selected: false,
  selectLink: Function.prototype,
  width: defaultTheme.lineWidth
}

export default Link
