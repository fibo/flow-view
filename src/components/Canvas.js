import React, { PropTypes } from 'react'
import Link from './Link'
import Node from './Node'
import { Svg } from 'svgx'

const Canvas = ({
  nodes, links,
  height, width,
  selectNode,
  dragItems,
  endDraggingItems,
  previousDraggingPoint
}) => {
  const toLink = (link) => <Link key={link.id} {...link} />

  return (
    <Svg
      height={height}
      width={width}
    >
      {
        nodes.map(
          (node, i) => {
            return (
              <Node
                key={i}
                selectNode={selectNode(node.id)}
                endDragging={endDraggingItems}
                dragItems={dragItems(previousDraggingPoint)}
                {...node}
              />

            )

          }
        )
      }

      {links.map(toLink)}
    </Svg>
  )
}

Canvas.propTypes = Object.assign({
  links: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
  previousDraggingPoint: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  })
}, Svg.propTypes)

export default Canvas
