import React, { PropTypes } from 'react'
import Link from './Link'
import Node from './Node'
import NodeSelector from './NodeSelector'
import { Svg } from 'svgx'

const Canvas = ({
  nodes, links,
  height, width,
  hideNodeSelector,
  pinSize,
  selectLink,
  selectNode,
  createLink,
  dragItems,
  endDraggingItems,
  showNodeSelector,
  nodeSelectorX,
  nodeSelectorY,
  nodeSelectorShow,
  nodeSelectorText,
  setNodeSelectorText,
  previousDraggingPoint
}) => (
  <Svg
    height={height}
    width={width}
    style={{border: '1px solid black'}}
    onClick={hideNodeSelector}
    onDoubleClick={showNodeSelector}
  >
    <NodeSelector
      changeText={setNodeSelectorText}
      show={nodeSelectorShow}
      x={nodeSelectorX}
      y={nodeSelectorY}
      text={nodeSelectorText}
    />
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
          selectLink={selectLink(link.id)}
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
