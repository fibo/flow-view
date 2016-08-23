import React, { PropTypes } from 'react'
import initialState from '../util/initialState'
import Link from './Link'
import Node from './Node'
import NodeSelector from './NodeSelector'
import {
  dragItems,
  dragLink,
  endDraggingItems,
  endDraggingLink,
  hideNodeSelector,
  showNodeSelector
} from '../actions'

const Canvas = ({
  dispatch,
  nodes, links,
  height, width,
  pinRadius,
  addNode,
  delNode,
  deleteLink,
  selectLink,
  selectNode,
  offset,
  draggedLinkId,
  isDraggingLink,
  isDraggingItems,
  nodeSelectorX,
  nodeSelectorY,
  nodeSelectorShow,
  nodeSelectorText,
  setNodeSelectorText,
  setNumIns,
  setNumOuts,
  previousDraggingPoint
}) => {
  const onDragLink = (previousDraggingPoint) => (e) => {
    e.preventDefault()
    e.stopPropagation()

    const draggingDelta = {
      x: e.clientX - offset.x - previousDraggingPoint.x,
      y: e.clientY - offset.y - previousDraggingPoint.y
    }

    dispatch(dragLink(previousDraggingPoint, draggingDelta))
  }

  const onEndDraggingLink = (draggedLinkId) => (e) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch(endDraggingLink(draggedLinkId))
  }

  const onDragItems = (previousDraggingPoint) => (e) => {
    e.preventDefault()
    e.stopPropagation()

    const draggingDelta = {
      x: e.clientX - offset.x - previousDraggingPoint.x,
      y: e.clientY - offset.y - previousDraggingPoint.y
    }

    dispatch(dragItems(previousDraggingPoint, draggingDelta))
  }

  const onEndDraggingItems = (e) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch(endDraggingItems())
  }

  const onHideNodeSelector = (e) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch(hideNodeSelector())
  }

  const onShowNodeSelector: (e) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch(showNodeSelector({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    }))
  }

  return (
    <svg
      height={height}
      width={width}
      style={{border: '1px solid black'}}
      onMouseDown={onHideNodeSelector}
      onDoubleClick={onShowNodeSelector}
      onMouseMove={isDraggingLink ? onDragLink(previousDraggingPoint) : isDraggingItems ? onDragItems(previousDraggingPoint) : undefined}
      onMouseUp={isDraggingLink ? onEndDraggingLink(draggedLinkId) : isDraggingItems ? onEndDraggingItems : undefined}
    >

      <NodeSelector
        dispatch={dispatch}
        x={nodeSelectorX}
        y={nodeSelectorY}
        text={nodeSelectorText}
        show={nodeSelectorShow}
        changeText={setNodeSelectorText}
        addNode={addNode}
      />

      {nodes.map(
        (node, i) => (
          <Node
            dispatch={dispatch}
            key={i}
            pinRadius={pinRadius}
            offset={offset}
            selectNode={selectNode(node.id)}
            delNode={delNode(node.id)}
            endDragging={onEndDraggingItems}
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
}

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
