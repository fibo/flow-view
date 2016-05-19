import React from 'react'

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

export default Node
