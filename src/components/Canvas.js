import React, { PropTypes } from 'react'
import Link from './Link'
import Node from './Node'
import { Svg } from 'svgx'

const Canvas = ({
  nodes, links,
  height, width,
  pinSize,
  selectNode,
  createLink,
  dragItems,
  endDraggingItems,
  previousDraggingPoint
}) => (
  <Svg
    height={height}
    width={width}
  >
    {nodes.map(
      (node, i) => (
        <Node
          key={i}
          pinSize={pinSize}
          createLink={createLink}
          selectNode={selectNode(node.id)}
          endDragging={endDraggingItems}
          dragItems={dragItems(previousDraggingPoint)}
          {...node}
        />
      )
    )}

    {links.map(
      (link) => (
        <Link
          key={link.id}
          {...link}
        />
      )
    )}
  </Svg>
)

Canvas.propTypes = Object.assign({
  links: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
  pinSize: PropTypes.number.isRequired,
  previousDraggingPoint: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  })
}, Svg.propTypes)

Canvas.defaultProps = {
  pinSize: 10
}

export default Canvas
