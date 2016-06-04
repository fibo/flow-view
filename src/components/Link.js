import React, { PropTypes } from 'react'

const stroke = '#333333'
const strokeWidth = 3
const highlighted = {
  stroke: 'orange',
  strokeWidth: 4
}

const Link = ({
  x, y,
  x2, y2,
  selected,
  selectLink
}) => (
  <g
    onMouseDown={selectLink}
  >
    <line
      x1={x} y1={y} x2={x2} y2={y2}
      stroke={selected ? highlighted.stroke : stroke}
      strokeWidth={selected ? highlighted.strokeWidth : strokeWidth}
    ></line>
  </g>
)

Link.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  x2: PropTypes.number,
  y2: PropTypes.number
}

export default Link
