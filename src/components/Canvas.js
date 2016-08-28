import React, { Component, PropTypes } from 'react'
import emptyView from '../util/emptyView'
import Link from './Link'
import Node from './Node'
import NodeSelector from './NodeSelector'
import {
  addNode,
  addLink,
  deleteLink,
  deleteNode,
  dragItems,
  dragLink,
  endDraggingItems,
  endDraggingLink,
  hideNodeSelector,
  selectItem,
  setNumIns,
  setNumOuts,
  showNodeSelector
} from '../actions'

class Canvas extends Component {
  render () {
    const {
      dispatch,
      nodes, links,
      height, width,
      pinRadius,
      offset,
      draggedLinkId,
      isDraggingLink,
      isDraggingItems,
      nodeSelectorX,
      nodeSelectorY,
      nodeSelectorShow,
      nodeSelectorText,
      previousDraggingPoint
    } = this.props

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

    const onDeleteNode = (nodeid) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(deleteNode(nodeid))
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

    const onShowNodeSelector = (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(showNodeSelector({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      }))
    }

    const selectLink = (linkid) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(selectItem({
        id: linkid,
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      }))
    }

    const selectNode = (nodeid) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(selectItem({
        id: nodeid,
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      }))
    }

    const onDeleteLink = (linkid) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(deleteLink(linkid))
    }

    const onSetNumIns = (nodeid) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(setNumIns({
        nodeid,
        num: e.target.value
      }))
    }

    const onSetNumOuts = (nodeid) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(setNumOuts({
        nodeid,
        num: e.target.value
      }))
    }

    const onAddNode = ({ x, y, text }) => {
      dispatch(addNode({ x, y, text }))
    }

    const onAddLink = ({ from, to }, previousDraggingPoint) => {
      dispatch(addLink({ from, to }, previousDraggingPoint))
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
          x={nodeSelectorX}
          y={nodeSelectorY}
          text={nodeSelectorText}
          show={nodeSelectorShow}
          addNode={onAddNode}
        />

        {nodes.map(
          (node, i) => (
            <Node
              key={i}
              pinRadius={pinRadius}
              offset={offset}
              selectNode={selectNode(node.id)}
              delNode={onDeleteNode(node.id)}
              addLink={onAddLink}
              endDragging={onEndDraggingItems}
              isDraggingLink={isDraggingLink}
              setNumIns={onSetNumIns(node.id)}
              setNumOuts={onSetNumOuts(node.id)}
              {...node}
            />
          )
        )}

        {links.map(
          (link) => (
            <Link
              pinRadius={pinRadius}
              selectLink={selectLink(link.id)}
              deleteLink={onDeleteLink(link.id)}
              key={link.id}
              {...link}
            />
          )
        )}
      </svg>
    )
  }
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

// TODO emptyView.pinRadius should be in defaultTheme
Canvas.defaultProps = {
  pinRadius: emptyView.pinRadius
}

export default Canvas
