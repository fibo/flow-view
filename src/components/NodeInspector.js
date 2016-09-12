import React, { PropTypes } from 'react'

const NodeInspector = ({
  x,
  y
}) => (
  <foreignObject
    x={x}
    y={y}
    width={200}
    height={20}
  >
    <p>'Halo inspektor'</p>
  </foreignObject>
)

NodeInspector.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number
}

export default NodeInspector
