import React, { PropTypes } from 'react'
import initialState from '../util/initialState'
import Link from './Link'
import Node from './Node'
import NodeSelector from './NodeSelector'

const Canvas = ({
  dispatch,
  nodes, links,
  height, width,
  hideNodeSelector,
  pinRadius,
  addNode,
  delNode,
  deleteLink,
  selectLink,
  selectNode,
  addLink,
  draggedLinkId,
  isDraggingLink,
  isDraggingItems,
  dragItems,
  dragLink,
  endDraggingItems,
  endDraggingLink,
  showNodeSelector,
  nodeSelectorX,
  nodeSelectorY,
  nodeSelectorShow,
  nodeSelectorText,
  setNodeSelectorText,
  setNumIns,
  setNumOuts,
  previousDraggingPoint
}) => (
  <svg
    height={height}
    width={width}
    style={{border: '1px solid black'}}
    onMouseDown={hideNodeSelector}
    onDoubleClick={showNodeSelector}
    onMouseMove={isDraggingLink ? dragLink(previousDraggingPoint) : isDraggingItems ? dragItems(previousDraggingPoint) : undefined}
    onMouseUp={isDraggingLink ? endDraggingLink(draggedLinkId) : isDraggingItems ? endDraggingItems : undefined}
  >

    <NodeSelector
      x={nodeSelectorX}
      y={nodeSelectorY}
      text={nodeSelectorText}
      show={nodeSelectorShow}
      changeText={setNodeSelectorText}
      addNode={addNode}
      dispatch={dispatch}
    />

    {nodes.map(
      (node, i) => (
        <Node
          key={i}
          pinRadius={pinRadius}
          addLink={addLink}
          selectNode={selectNode(node.id)}
          delNode={delNode(node.id)}
          endDragging={endDraggingItems}
          isDraggingLink={isDraggingLink}
          setNumIns={setNumIns(node.id)}
          setNumOuts={setNumOuts(node.id)}
          {...node}
        />
      )
    )}

    {links.map(
      (link) => (
        <Link
          pinRadius={pinRadius}
          selectLink={selectLink(link.id)}
          deleteLink={deleteLink(link.id)}
          key={link.id}
          {...link}
        />
      )
    )}
  </svg>
)

Canvas.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  links: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
  pinRadius: PropTypes.number.isRequired,
  previousDraggingPoint: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  })
}

Canvas.defaultProps = {
  pinRadius: initialState.pinRadius
}

export default Canvas
