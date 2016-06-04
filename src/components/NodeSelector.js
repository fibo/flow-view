import React, { PropTypes } from 'react'

const NodeSelector = ({
  x, y
}) => (
  <foreignObject
    x={x}
    y={y}
    width={100}
    height={100}
  >
    <p>I am a Node selector</p>
  </foreignObject>
)

export default NodeSelector
