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
  selectItem,
  setNumIns,
  setNumOuts
} from '../actions'

class Canvas extends Component {
  constructor () {
    super()

    this.state = {
      pointer: { x: 0, y: 0 },
      showNodeSelector: false
    }
  }

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
      previousDraggingPoint
    } = this.props

    const {
      pointer,
      showNodeSelector
    } = this.state

    const setState = this.setState.bind(this)

    const getCoordinates = (e) => ({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    })

    const onDragLink = (previousDraggingPoint) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      const draggingDelta = {
        x: e.clientX - offset.x - previousDraggingPoint.x,
        y: e.clientY - offset.y - previousDraggingPoint.y
      }

      setState({
        pointer: getCoordinates(e)
      })

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

    const onClick = (e) => {
      e.preventDefault()
      e.stopPropagation()

      setState({
        showNodeSelector: false
      })
    }

    const onDoubleClick = (e) => {
      e.preventDefault()
      e.stopPropagation()

      setState({
        pointer: getCoordinates(e),
        showNodeSelector: true
      })
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
        fontFamily='Courier'
        fontSize={17}
        textAnchor='start'
        style={{border: '1px solid black'}}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseMove={isDraggingLink ? onDragLink(previousDraggingPoint) : isDraggingItems ? onDragItems(previousDraggingPoint) : undefined}
        onMouseUp={isDraggingLink ? onEndDraggingLink(draggedLinkId) : isDraggingItems ? onEndDraggingItems : undefined}
      >
        <NodeSelector
          addNode={onAddNode}
          x={pointer.x}
          y={pointer.y}
          show={showNodeSelector}
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
  height: 400,
  pinRadius: emptyView.pinRadius,
  width: 400
}

export default Canvas
