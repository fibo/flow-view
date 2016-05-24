import React, { PropTypes } from 'react'
import Link from './Link'
import Node from './Node'
import { Svg } from 'svgx'

const toLink = (link) => <Link key={link.id} {...link} />
const toNode = (node) => <Node key={node.id} {...node} />

const Canvas = ({
  nodes, links,
  height, width
}) => {
  return (
    <Svg height={height} width={width}>
      {nodes.map(toNode)}
      {links.map(toLink)}
    </Svg>
  )
}

Canvas.propTypes = Object.assign({
  links: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired
}, Svg.propTypes)

export default Canvas
