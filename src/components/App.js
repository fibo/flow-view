import React from 'react'
import { Svg } from 'svgx'
import Link from './Link'
import Node from './Node'

const App = (props) => {
  let nodes = []

  for (var nodeid in props.node) {
    let node = props.node[nodeid]
    node.id = nodeid
    nodes.push(node)
  }

  let links = []

  for (var linkid in props.link) {
    let link = props.link[linkid]
    link.id = linkid
    links.push(link)
  }

  const toLink = (link) => <Link key={link.id} {...link} />
  const toNode = (node) => <Node key={node.id} {...node} />

  return (
    <Svg height={props.height} width={props.width}>
      {nodes.map(toNode)}
      {links.map(toLink)}
    </Svg>
  )
}

App.propTypes = Object.assign({}, Svg.propTypes)

export default App
