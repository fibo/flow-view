import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import computeNodeWidth from '../utils/computeNodeWidth'
import DefaultLink from './Link'
import DefaultNode from './Node'
import theme from './theme'
import ignoreEvent from '../utils/ignoreEvent'

import xOfPin from '../utils/xOfPin'
import Selector from './Selector'

const getTime = () => (new Date() / 1)

class Frame extends Component {
  constructor (props) {
    super(props)

    this.state = {
      dynamicView: { height: null, width: null },
      draggedLinkId: null,
      draggedItems: [],
      offset: { x: 0, y: 0 },
      pointer: null,
      scroll: { x: 0, y: 0 },
      showSelector: false,
      selectedItems: [],
      selectionBoundingBox: null,
      shiftPressed: false,
      whenUpdated: getTime() // this attribute is used to force React render.
    }
  }

  componentDidMount () {
    const {
      createInputPin,
      deleteInputPin,
      view
    } = this.props

    const {
      selectedItems,
      shiftPressed
    } = this.state

    const setState = this.setState.bind(this)

    const container = findDOMNode(this).parentNode

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Shift') setState({ shiftPressed: true })

      // TODO it prints [], FIXME selectedItems
      console.log(selectedItems)
      console.log(e.code, view.node)
      if (e.code === 'KeyI') {
        selectedItems.forEach((id) => {
          if (view.node[id].ins && Object.keys(view.node).indexOf(id) > -1) {
            if (shiftPressed) {
              deleteInputPin(id)
            } else {
              createInputPin(id)
            }
          }
        })
      }
    })

    document.addEventListener('keyup', (e) => {
      if (e.code === 'Shift') setState({ shiftPressed: false })
    })

    window.addEventListener('scroll', () => {
      setState({ scroll: {
        x: window.scrollX,
        y: window.scrollY
      }})
    })

    window.addEventListener('resize', () => {
      const rect = container.getBoundingClientRect()

      setState({ dynamicView: {
        height: rect.height,
        width: rect.width
      }})
    })

    const offset = {
      x: container.offsetLeft,
      y: container.offsetTop
    }

    const scroll = {
      x: window.scrollX,
      y: window.scrollY
    }

    setState({ offset, scroll })
  }

  render () {
    const {
      createInputPin,
      createLink,
      createNode,
      createOutputPin,
      deleteInputPin,
      deleteLink,
      deleteNode,
      deleteOutputPin,
      dragItems,
      fontSize,
      item,
      model,
      nodeList,
      theme,
      updateLink,
      view
    } = this.props

    const {
      draggedItems,
      draggedLinkId,
      pointer,
      dynamicView,
      selectedItems,
      showSelector
    } = this.state

    const {
      frameBorder,
      fontFamily,
      lineWidth,
      nodeBodyHeight,
      pinSize
    } = theme

    const height = dynamicView.height || view.height
    const width = dynamicView.width || view.width

    const typeOfNode = item.util.typeOfNode

    const Link = item.link.DefaultLink

    const setState = this.setState.bind(this)

    const coordinatesOfLink = ({ from, to }) => {
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
          bodyHeight: nodeBodyHeight,
          pinSize,
          fontSize,
          node: source
        })

        x1 = source.x + xOfPin(pinSize, computedWidth, source.outs.length, from[1])
        y1 = source.y + pinSize + nodeBodyHeight
      }

      if (targetId) {
        const target = view.node[targetId]

        computedWidth = computeNodeWidth({
          bodyHeight: nodeBodyHeight,
          pinSize,
          fontSize,
          node: target
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

      return { x1, y1, x2, y2 }
    }

    const getCoordinates = (e) => {
      const {
        offset,
        scroll
      } = this.state

      return {
        x: e.clientX - offset.x + scroll.x,
        y: e.clientY - offset.y + scroll.y
      }
    }

    const onClick = (e) => {
      e.preventDefault()
      e.stopPropagation()

      setState({ showSelector: false })
    }

    const onCreateLink = (link) => {
      const draggedLinkId = createLink(link)

      setState({ draggedLinkId })
    }

    const onUpdateLink = (id, link) => {
      updateLink(id, link)

      const disconnectingLink = (link.to === null)

      if (disconnectingLink) {
        link.id = id

        setState({ draggedLinkId: id })
      } else {
        setState({ draggedLinkId: null })
      }
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

      // TODO Shift key for multiple selection.
      // use state shiftPressed

      setState({
        selectedItems: []
      })
    }

    const onMouseLeave = (e) => {
      e.preventDefault()
      e.stopPropagation()

      const draggedLinkId = this.state.draggedLinkId
      if (draggedLinkId) delete view.link[draggedLinkId]

      setState({
        draggedItems: [],
        draggedLinkId: null,
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

      const draggedLinkId = this.state.draggedLinkId

      if (draggedLinkId) {
        delete view.link[draggedLinkId]

        setState({
          draggedLinkId: null,
          pointer: null
        })
      } else {
        setState({
          draggedItems: [],
          selectedItems: [],
          pointer: null
        })
      }
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

      let boundingBox = null

      // Do not select items when releasing a dragging link.

      const draggedLinkId = this.state.draggedLinkId

      if (draggedLinkId) {
        delete view.link[draggedLinkId]

        setState({
          draggedLinkId: null
        })

        return
      }

      var selectedItems = Object.assign([], this.state.selectedItems)

      const index = selectedItems.indexOf(id)

      if (index === -1) {
        // Shift key allows multiple selection.
        if (e.shiftKey) {
          // TODO it does not work.
          selectedItems.push(id)
        } else {
          selectedItems = [id]
        }
      } else {
        selectedItems.splice(index, 1)
      }

      selectedItems.forEach((id) => {
        var link = view.link[id]
        var node = view.node[id]

        if (node) {
          const computedWidth = computeNodeWidth({
            bodyHeight: nodeBodyHeight,
            pinSize,
            fontSize,
            node
          })

          boundingBox = {
            x1: node.x,
            y1: node.y,
            x2: computedWidth + node.x,
            y2: nodeBodyHeight + node.y
          }
        }

        if (link) {
          boundingBox = coordinatesOfLink(link)
        }
      })

      setState({
        draggedItems: [],
        selectedItems,
        selectionBoundingBox: boundingBox
      })
    }

    const startDraggingLinkTarget = (id) => {
      // Remember link source.
      const from = view.link[id].from

      // Delete dragged link so the 'deleteLink' event is triggered.
      deleteLink(id)

      // Create a brand new link, this is the right choice to avoid
      // conflicts, for example the user could start dragging the link
      // target and then drop it again in the same target.
      const draggedLinkId = createLink({ from })
      setState({ draggedLinkId })
    }

    const willDragItem = (id) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      var draggedItems = Object.assign([], this.state.draggedItems)

      const index = draggedItems.indexOf(id)

      if (index === -1) {
        // Shift key allows multiple selection.
        if (e.shiftKey) {
          // TODO it does not work.
          draggedItems.push(id)
        } else {
          draggedItems = [id]
        }
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
        style={{border: frameBorder}}
        width={width}
      >
        {Object.keys(view.node).sort(selectedFirst).map((id, i) => {
          const node = view.node[id]

          const {
            height,
            ins,
            outs,
            text,
            width,
            x,
            y
          } = node

          const nodeType = typeOfNode(node)
          const Node = item.node[nodeType]

          return (
            <Node key={i}
              createInputPin={createInputPin}
              createOutputPin={createOutputPin}
              dragged={(draggedItems.indexOf(id) > -1)}
              draggedLinkId={draggedLinkId}
              deleteInputPin={deleteInputPin}
              deleteNode={deleteNode}
              deleteOutputPin={deleteOutputPin}
              fontSize={fontSize}
              height={height}
              id={id}
              ins={ins}
              model={model}
              onCreateLink={onCreateLink}
              outs={outs}
              pinSize={pinSize}
              selected={(selectedItems.indexOf(id) > -1)}
              selectNode={selectItem(id)}
              text={text}
              updateLink={onUpdateLink}
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

          const coord = coordinatesOfLink(view.link[id])
          const sourceSelected = from ? (
            (draggedItems.indexOf(from[0]) > -1) || (selectedItems.indexOf(from[0]) > -1)
          ) : false
          const targetSelected = to ? (
            (draggedItems.indexOf(to[0]) > -1) || (selectedItems.indexOf(to[0]) > -1)
          ) : false

          return (
            <Link key={i}
              deleteLink={deleteLink}
              from={from}
              lineWidth={lineWidth}
              id={id}
              onCreateLink={onCreateLink}
              startDraggingLinkTarget={startDraggingLinkTarget}
              pinSize={pinSize}
              selected={(selectedItems.indexOf(id) > -1)}
              selectLink={selectItem}
              sourceSelected={sourceSelected}
              targetSelected={targetSelected}
              to={to}
              x1={coord.x1}
              y1={coord.y1}
              x2={coord.x2}
              y2={coord.y2}
            />
          )
        })}
        <Selector
          createNode={(node) => {
            const id = createNode(node)

            setState({
              selectedItems: [id],
              showSelector: false,
              whenUpdated: getTime()
            })
          }}
          nodeList={nodeList}
          pointer={pointer}
          show={showSelector}
        />
      </svg>
    )
  }
}

Frame.propTypes = {
  createInputPin: PropTypes.func.isRequired,
  createOutputPin: PropTypes.func.isRequired,
  createLink: PropTypes.func.isRequired,
  createNode: PropTypes.func.isRequired,
  deleteLink: PropTypes.func.isRequired,
  deleteInputPin: PropTypes.func.isRequired,
  deleteNode: PropTypes.func.isRequired,
  deleteOutputPin: PropTypes.func.isRequired,
  dragItems: PropTypes.func.isRequired,
  fontSize: PropTypes.number.isRequired,
  item: PropTypes.shape({
    link: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    util: PropTypes.shape({
      typeOfNode: PropTypes.func.isRequired
    })
  }).isRequired,
  theme: theme.propTypes,
  updateLink: PropTypes.func.isRequired,
  view: PropTypes.shape({
    height: PropTypes.number.isRequired,
    link: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired
  }).isRequired
}

Frame.defaultProps = {
  createLink: Function.prototype,
  createNode: Function.prototype,
  createInputPin: Function.prototype,
  createOutputPin: Function.prototype,
  deleteInputPin: Function.prototype,
  deleteLink: Function.prototype,
  deleteNode: Function.prototype,
  deleteOutputPin: Function.prototype,
  dragItems: Function.prototype,
  fontSize: 17, // FIXME fontSize seems to be ignored
  item: {
    link: { DefaultLink },
    node: { DefaultNode },
    util: {
      typeOfNode: function (node) {
        return 'DefaultNode'
      }
    }
  },
  theme: theme.defaultProps,
  updateLink: Function.prototype,
  view: {
    link: {},
    node: {}
  }
}

export default Frame
