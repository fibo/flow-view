import React from 'react'
import Svg from 'svgx'
import Links from './Links'
import Nodes from './Nodes'

const Canvas = ({height, width}) => {
  return (
    <Svg height={height} width={width}>
      <Nodes />
      <Links />
    </Svg>
  )
}

Canvas.propTypes = Object.assign({}, Svg.propTypes)

export default Canvas
