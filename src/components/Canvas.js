import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Inspector from './Inspector'
import Node from './Node'
import Selector from './Selector'

class Canvas extends Component {
  constructor () {
    super()

    this.state = {
      pointer: null,
      showSelector: false,
      selectedItems: []
    }
  }

  componentDidMount () {
    const container = findDOMNode(this).parentNode

    const offset = {
      x: container.offsetLeft,
      y: container.offsetTop
    }

    this.setState({ offset })
  }

  render () {
    const {
      createNode,
      dragItems,
      fontSize,
      height,
      style,
      view,
      width
    } = this.props

    const {
      offset,
      pointer,
      showSelector
    } = this.state

    const fontFamily = 'Courier'

    const setState = this.setState.bind(this)

    const getCoordinates = (e) => ({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    })

    const hideSelector = () => {
      // TODO It should be better to have emit('createNode', node)
      // in the Selector and
      // on('createNode', () => {
      //   setState({ showSelector: false })
      // })
      // in the Canvas.

      // Need to change state to force React rendering.
      setState({
        showSelector: false
      })
    }

    const onClick = (e) => {
      e.preventDefault()
      e.stopPropagation()

      setState({
        showSelector: false
      })
    }

    const onDoubleClick = (e) => {
      e.preventDefault()
      e.stopPropagation()

      setState({
        pointer: getCoordinates(e),
        showSelector: true
      })
    }

    const onMouseEnter = (e) => {
      e.preventDefault()
      e.stopPropagation()

      setState({
        pointer: getCoordinates(e)
      })
    }

    const onMouseLeave = (e) => {
      e.preventDefault()
      e.stopPropagation()

      setState({
        pointer: null,
        showSelector: false
      })
    }

    const onMouseMove = (e) => {
      e.preventDefault()
      e.stopPropagation()

      const selectedItems = this.state.selectedItems

      if (selectedItems.length === 0) return

      const nextPointer = getCoordinates(e)

      const draggingDelta = {
        x: nextPointer.x - pointer.x,
        y: nextPointer.y - pointer.y
      }

      dragItems(draggingDelta, selectedItems)

      setState({
        pointer: nextPointer
      })
    }

    return (
      <svg
        fontFamily={fontFamily}
        fontSize={fontSize}
        height={height}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        textAnchor='start'
        style={style}
        width={width}
      >
        <Inspector
          height={height}
        />
        {Object.keys(view.node)
               .map((id) => (view.node[id]))
               .map(({
                 height,
                 ins,
                 outs,
                 text,
                 width,
                 x,
                 y
               }, i) => (
                 <Node
                   key={i}
                   fontSize={fontSize}
                   height={height}
                   ins={ins}
                   outs={outs}
                   text={text}
                   width={width}
                   x={x}
                   y={y}
                 />
               ))
        }
        <Selector
          createNode={(node) => {
            createNode(node)
            hideSelector()
          }}
          fontFamily={fontFamily}
          pointer={pointer}
          show={showSelector}
        />
      </svg>
    )
  }
    /*

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
  */
}

Canvas.propTypes = {
  createNode: PropTypes.func.isRequired,
  dragItems: PropTypes.func.isRequired,
  fontSize: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  view: PropTypes.shape({
    link: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired
  }).isRequired,
  width: PropTypes.number.isRequired
}

Canvas.defaultProps = {
  createNode: Function.prototype,
  dragItems: Function.prototype,
  fontSize: 17, // FIXME fontSize seems to be ignored
  height: 400,
  style: { border: '1px solid black' },
  view: {
    link: {},
    node: {}
  },
  width: 400
}

export default Canvas
