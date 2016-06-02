import React, { PropTypes } from 'react'

const stroke = '#333333'
const strokeWidth = 3

const Link = ({
  x, y, x2, y2
}) => (
  <g>
    <line
      x1={x} y1={y} x2={x2} y2={y2}
      stroke={stroke}
      strokeWidth={strokeWidth}
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
