import React, { Component, PropTypes } from 'react'
import xCenterOfPin from '../utils/xCenterOfPin'
import emptyView from '../utils/emptyView'
import Link from './Link'
import Node from './Node'
import NodeSelector from './NodeSelector'

class Canvas extends Component {
  constructor () {
    super()

    this.state = {
      links: [],
      pointer: { x: 0, y: 0 },
      showNodeSelector: false
    }
  }

  render () {
    const {
      node,
      height, width,
      pinRadius,
      offset,
      isDraggingLink,
      isDraggingItems,
      selectedItems,
      previousDraggingPoint
    } = this.props

    var {
      draggedLinkId
    } = this.props

    const {
      pointer,
      showNodeSelector
    } = this.state

    const setState = this.setState.bind(this)

    let links = []

    for (let id in this.props.link) {
      const link = Object.assign({},
        this.prop.link[id]
      )

      let x = null
      let y = null
      let x2 = null
      let y2 = null

      for (let node of nodes) {
        // Source node.
        if ((Array.isArray(link.from)) && (node.id === link.from[0])) {
          const position = link.from[1] || 0
          x = node.x + xCenterOfPin(pinRadius, node.width, node.outs.length, position)
          y = node.y + node.height - pinRadius
        }

        // Target node.
        if ((Array.isArray(link.to)) && (node.id === link.to[0])) {
          const position = link.to[1] || 0
          x2 = node.x + xCenterOfPin(pinRadius, node.width, node.ins.length, position)
          y2 = node.y + pinRadius
        }
      }

      if (link.from === null) {
        draggedLinkId = id
        x = previousDraggingPoint.x
        y = previousDraggingPoint.y
      }

      if (link.to === null) {
        draggedLinkId = id
        x2 = previousDraggingPoint.x
        y2 = previousDraggingPoint.y
      }

      links.push({
        dragged: (draggedLinkId === id),
        id,
        selected: (selectedItems.indexOf(id) > -1),
        x,
        y,
        x2,
        y2
      })
    }

    const getCoordinates = (e) => ({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    })

    const onDragLink = (pointer) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      const draggingDelta = {
        x: e.clientX - offset.x - pointer.x,
        y: e.clientY - offset.y - pointer.y
      }

      setState({
        pointer: getCoordinates(e)
      })
    }

    const onEndDraggingLink = (draggedLinkId) => (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const onDragItems = (previousDraggingPoint) => (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const onDeleteNode = (nodeid) => (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const onEndDraggingItems = (e) => {
      e.preventDefault()
      e.stopPropagation()
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
    }

    const selectNode = (nodeid) => (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const onDeleteLink = (linkid) => (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const onSetNumIns = (nodeid) => (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const onSetNumOuts = (nodeid) => (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const onAddNode = ({ x, y, text }) => {
    }

    const onAddLink = ({ from, to }, previousDraggingPoint) => {
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
        onMouseMove={isDraggingLink ? onDragLink(pointer) : isDraggingItems ? onDragItems(previousDraggingPoint) : undefined}
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
  link: PropTypes.object.isRequired,
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
