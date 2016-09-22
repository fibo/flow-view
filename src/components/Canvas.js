import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import computeNodeWidth from '../utils/computeNodeWidth'
import DefaultLink from './Link'
import DefaultNode from './Node'
import defaultTheme from './theme'
import ignoreEvent from '../utils/ignoreEvent'
import Inspector from './Inspector'
import xOfPin from '../utils/xOfPin'
import Selector from './Selector'

class Canvas extends Component {
  constructor (props) {
    super(props)

    this.state = {
      draggedLink: null,
      draggedItems: [],
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
      createLink,
      createNode,
      deleteLink,
      dragItems,
      fontFamily,
      fontSize,
      height,
      item,
      lineWidth,
      nodeBodyHeight,
      pinSize,
      style,
      updateLink,
      view,
      width
    } = this.props

    const {
      draggedItems,
      draggedLink,
      offset,
      pointer,
      selectedItems,
      showSelector
    } = this.state

    const Link = item.link.DefaultLink
    const Node = item.node.DefaultNode

    const setState = this.setState.bind(this)

    const getCoordinates = (e) => ({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    })

    const onClick = (e) => {
      e.preventDefault()
      e.stopPropagation()

      setState({
        showSelector: false
      })
    }

    const onCreateLink = (link) => {
      const id = createLink(link)

      link.id = id

      setState({
        draggedLink: link
      })
    }

    const onUpdateLink = (id, link) => {
      updateLink(id, link)

      link.id = id

      setState({
        draggedLink: link
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

    const onMouseDown = (e) => {
      e.preventDefault()
      e.stopPropagation()

      // TODO CTRL key for multiple selection.

      setState({
        selectedItems: []
      })
    }

    const onMouseLeave = (e) => {
      e.preventDefault()
      e.stopPropagation()

      const draggedLink = this.state.draggedLink
      if (draggedLink) deleteLink(draggedLink.id)

      setState({
        draggedItems: [],
        draggedLink: null,
        pointer: null,
        showSelector: false
      })
    }

    const onMouseMove = (e) => {
      e.preventDefault()
      e.stopPropagation()

      const nextPointer = getCoordinates(e)

      setState({
        pointer: nextPointer
      })

      const draggedItems = this.state.draggedItems

      if (draggedItems.length > 0) {
        const draggingDelta = {
          x: (pointer ? nextPointer.x - pointer.x : 0),
          y: (pointer ? nextPointer.y - pointer.y : 0)
        }

        dragItems(draggingDelta, draggedItems)
      }
    }

    const onMouseUp = (e) => {
      e.preventDefault()
      e.stopPropagation()

      const draggedLink = this.state.draggedLink
      if (draggedLink) deleteLink(draggedLink.id)

      setState({
        draggedLink: null,
        selectedItems: [],
        pointer: null
      })
    }

    /**
     * Bring up selected nodes.
     */

    const selectedFirst = (a, b) => {
      // FIXME it works, but it would be nice if the selected
      // items keep being up after deselection.
      const aIsSelected = (selectedItems.indexOf(a) > -1)
      const bIsSelected = (selectedItems.indexOf(b) > -1)

      if (aIsSelected && bIsSelected) return 0

      if (aIsSelected) return 1
      if (bIsSelected) return -1
    }

    const selectItem = (id) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      // Do not select items when releasing a dragging link.

      const draggedLink = this.state.draggedLink

      if (draggedLink) {
        deleteLink(draggedLink.id)

        setState({
          draggedLink: null
        })

        return
      }

      var selectedItems = Object.assign([], this.state.selectedItems)

      const index = selectedItems.indexOf(id)

      if (index === -1) {
        selectedItems = [id]
        // TODO if CTRL key pressed: selectedItems.push(id)
      } else {
        selectedItems.splice(index, 1)
      }

      setState({
        draggedItems: [],
        selectedItems
      })
    }

    const willDragItem = (id) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      var draggedItems = Object.assign([], this.state.draggedItems)

      const index = draggedItems.indexOf(id)

      if (index === -1) {
        draggedItems = [id]
        // TODO if CTRL key pressed: draggedItems.push(id)
      }

      setState({
        draggedItems,
        selectedItems: []
      })
    }

    return (
      <svg
        fontFamily={fontFamily}
        fontSize={fontSize}
        height={height}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseDown={onMouseDown}
        onMouseEnter={ignoreEvent}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        textAnchor='start'
        style={style}
        width={width}
      >
        <Inspector
          selectedItems={selectedItems}
          height={height}
        />
        {Object.keys(view.node).sort(selectedFirst).map((id, i) => {
          const {
            height,
            ins,
            outs,
            text,
            width,
            x,
            y
          } = view.node[id]

          return (
            <Node
              key={i}
              dragged={(draggedItems.indexOf(id) > -1)}
              draggedLink={draggedLink}
              fontSize={fontSize}
              height={height}
              id={id}
              ins={ins}
              onCreateLink={onCreateLink}
              outs={outs}
              pinSize={pinSize}
              selected={(selectedItems.indexOf(id) > -1)}
              selectNode={selectItem(id)}
              text={text}
              updateLink={updateLink}
              width={width}
              willDragNode={willDragItem(id)}
              x={x}
              y={y}
            />
          )
        })}
        {Object.keys(view.link).map((id, i) => {
          const {
            from,
            to
          } = view.link[id]

          var x1 = null
          var y1 = null
          var x2 = null
          var y2 = null

          const nodeIds = Object.keys(view.node)
          const idEquals = (x) => (id) => (id === x[0])
          const sourceId = (from ? nodeIds.find(idEquals(from)) : null)
          const targetId = (to ? nodeIds.find(idEquals(to)) : null)

          var computedWidth = null

          if (sourceId) {
            const source = view.node[sourceId]

            computedWidth = computeNodeWidth({
              bodyHeight: nodeBodyHeight, // TODO custom nodes height
              pinSize,
              fontSize,
              text: source.text,
              width: source.width
            })

            x1 = source.x + xOfPin(pinSize, computedWidth, source.outs.length, from[1])
            y1 = source.y + pinSize + nodeBodyHeight
          }

          if (targetId) {
            const target = view.node[targetId]

            computedWidth = computeNodeWidth({
              bodyHeight: nodeBodyHeight, // TODO custom nodes height
              pinSize,
              fontSize,
              text: target.text,
              width: target.width
            })

            x2 = target.x + xOfPin(pinSize, computedWidth, target.ins.length, to[1])
            y2 = target.y
          } else {
            // FIXME at first, pointer is null. This trick works, but,
            // it should be reviosioned when implementing creating links
            // in the opposite direction.
            x2 = pointer ? (pointer.x - pinSize / 2) : x1
            y2 = pointer ? (pointer.y - pinSize) : y1
          }

          return (
            <Link
              key={i}
              from={from}
              lineWidth={lineWidth}
              id={id}
              onCreateLink={onCreateLink}
              onUpdateLink={onUpdateLink}
              pinSize={pinSize}
              selected={(selectedItems.indexOf(id) > -1)}
              selectLink={selectItem(id)}
              to={to}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
            />
          )
        })}
        <Selector
          createNode={(node) => {
            createNode(node)

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
          }}
          fontFamily={fontFamily}
          pointer={pointer}
          show={showSelector}
        />
      </svg>
    )
  }
}

Canvas.propTypes = {
  createLink: PropTypes.func.isRequired,
  createNode: PropTypes.func.isRequired,
  deleteLink: PropTypes.func.isRequired,
  dragItems: PropTypes.func.isRequired,
  fontFamily: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  item: PropTypes.shape({
    link: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired
  }).isRequired,
  nodeBodyHeight: PropTypes.number.isRequired,
  lineWidth: PropTypes.number.isRequired,
  pinSize: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  updateLink: PropTypes.func.isRequired,
  view: PropTypes.shape({
    link: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired
  }).isRequired,
  width: PropTypes.number.isRequired
}

Canvas.defaultProps = {
  createLink: Function.prototype,
  createNode: Function.prototype,
  deleteLink: Function.prototype,
  dragItems: Function.prototype,
  fontFamily: defaultTheme.fontFamily,
  fontSize: 17, // FIXME fontSize seems to be ignored
  height: 400,
  item: {
    link: { DefaultLink },
    node: { DefaultNode }
  },
  lineWidth: defaultTheme.lineWidth,
  nodeBodyHeight: defaultTheme.nodeBodyHeight,
  pinSize: defaultTheme.pinSize,
  style: { border: '1px solid black' },
  updateLink: Function.prototype,
  view: {
    link: {},
    node: {}
  },
  width: 400
}

export default Canvas
