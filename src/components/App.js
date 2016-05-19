import React from 'react'
import { Svg } from 'svgx'
import Links from './Links'
import Nodes from './Nodes'

const App = ({height, width, node}) => {
  return (
    <Svg height={height} width={width}>
      <Nodes node={node} />
      <Links />
    </Svg>
  )
}

App.propTypes = Object.assign({}, Svg.propTypes)

export default App
