import React, { PropTypes } from 'react'

const Node = ({x, y, w, h, text, ins, outs}) => {
  const transform = `matrix(1,0,0,1,${x},${y})`

  return (
    <g transform={transform}>
      <rect width={w} height={h} fill={'#cccccc'}>
        <text><tspan>Hello</tspan></text>
      </rect>
    </g>
  )
}

Node.propTypes = {
  ins: PropTypes.array.isRequired,
  outs: PropTypes.array.isRequired
}

export default Node
