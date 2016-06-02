import React, { PropTypes } from 'react'
import Link from './Link'
import Node from './Node'
import { Svg } from 'svgx'

const Canvas = ({
  nodes, links,
  height, width,
  selectNode,
  dragItems,
  endDraggingItem,
  startDraggingItem,
  startDraggingPoint
}) => {
  const toLink = (link) => <Link key={link.id} {...link} />

  return (
    <Svg height={height} width={width}>
      {
        nodes.map(
          (node, i) => {
            return (
              <Node
                key={i}
                selectNode={selectNode(node.id)}
                startDragging={startDraggingItem(node.id)}
                endDragging={endDraggingItem}
                startDraggingPoint={startDraggingPoint}
                dragItems={dragItems}
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
  nodes: PropTypes.array.isRequired
}, Svg.propTypes)

export default Canvas
