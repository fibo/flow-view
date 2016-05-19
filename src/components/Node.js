import React from 'react'

const Node = () => {
  const transform = 'matrix(1,0,0,1,180,200)'

  return (
    <g transform={transform}>
      <rect width={100} height={100} fill={'#cccccc'}>
      </rect>
    </g>
  )
}

export default Node
