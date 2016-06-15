import React, { PropTypes } from 'react'

const stroke = '#333333'
const strokeWidth = 3
const highlightedStrokeWidth = 4
const strokeDasharray = '5, 5'

const Link = ({
  x, y,
  x2, y2,
  pinRadius,
  selected, selectLink
}) => (
  <g
    onMouseDown={selectLink}
  >
    <circle
      cx={x}
      cy={y}
      r={pinRadius - 2}
    />
    <line
      x1={x} y1={y} x2={x2} y2={y2}
      stroke={stroke}
      strokeDasharray={selected ? strokeDasharray : undefined}
      strokeWidth={selected ? highlightedStrokeWidth : strokeWidth}
    />
    <circle
      cx={x2}
      cy={y2}
      r={pinRadius - 2}
    />
  </g>
)

Link.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  x2: PropTypes.number,
  y2: PropTypes.number
}

export default Link
