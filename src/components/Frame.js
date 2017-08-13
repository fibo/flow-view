import React from 'react'
import ReactDOM from 'react-dom'

import bindme from 'bindme'
import no from 'not-defined'

import DefaultLink from './Link'
import DefaultNode from './Node'
import Selector from './Selector'

import computeNodeWidth from '../utils/computeNodeWidth'
import ignoreEvent from '../utils/ignoreEvent'
import xOfPin from '../utils/xOfPin'

import { defaultTheme, Theme } from './theme'
import {
  CreateLink,
  CreateNode,
  CreatePin,
  DeleteLink,
  DeleteNode,
  DeletePin,
  FlowView
} from './types'

export default class Frame extends React.Component {
  props: {
    emitCreateInputPin: CreatePin,
    emitCreateLink: CreateLink,
    emitCreateNode: CreateNode,
    emitCreateOutputPin: CreatePin,
    emitDeleteInputPin: DeletePin,
    emitDeleteLink: DeleteLink,
    emitCreateNode: DeleteNode,
    emitDeleteOutputPin: DeletePin,
    theme: Theme,
    view: FlowView
  }

  constructor (props) {
    bindme(super(props),
      'onClick',
      'onDocumentKeydown',
      'onDocumentKeyup',
      'onDoubleClick',
      'onMouseDown',
      'onMouseLeave',
      'onMouseMove',
      'onMouseUp',
      'onWindowResize',
      'onWindowScroll',
      'selectorCreateNode'
     )

    this.state = {
      dynamicView: { height: null, width: null },
      draggedLinkId: null,
      dragging: false,
      dragMoved: false,
      offset: { x: 0, y: 0 },
      pointer: null,
      scroll: { x: 0, y: 0 },
      showSelector: false,
      selectedItems: [],
      shiftPressed: false,
      view: props.view
    }
  }

  componentDidMount () {
    const container = ReactDOM.findDOMNode(this).parentNode

    document.addEventListener('keydown', this.onDocumentKeydown)
    document.addEventListener('keyup', this.onDocumentKeyup)

    window.addEventListener('scroll', this.onWindowScroll)
    window.addEventListener('resize', this.onWindowResize(container))

    const offset = {
      x: container.offsetLeft,
      y: container.offsetTop
    }

    const scroll = {
      x: window.scrollX,
      y: window.scrollY
    }

    this.setState({ offset, scroll })
  }

  getCoordinates (event: MouseEvent) {
    const {
      offset,
      scroll
    } = this.state

    return {
      x: event.clientX - offset.x + scroll.x,
      y: event.clientY - offset.y + scroll.y
    }
  }

  onClick (event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    this.setState({ showSelector: false })
  }

  onDocumentKeydown (event: KeyboardEvent) {
    const { code } = event

    const {
      createInputPin,
      createOutputPin,
      deleteInputPin,
      deleteOutputPin,
      dragItems,
      endDragging
    } = this.props

    const {
      dragMoved,
      selectedItems,
      shiftPressed,
      view
    } = this.state

    const selectedNodes = this.selectedNodes()
    const thereAreSelectedNodes = (selectedNodes.length > 0)

    let draggingDelta = { x: 0, y: 0 }
    const unit = shiftPressed ? 1 : 10

    switch (code) {
      case 'ArrowDown':
        if (thereAreSelectedNodes) draggingDelta.y = unit
        break

      case 'ArrowLeft':
        if (thereAreSelectedNodes) draggingDelta.x = -unit
        break

      case 'ArrowRight':
        if (thereAreSelectedNodes) draggingDelta.x = unit
        break

      case 'ArrowUp':
        if (thereAreSelectedNodes) draggingDelta.y = -unit
        break

      case 'Escape':
        this.setState({ selectedItems: [] })
        break

      case 'KeyI':
        selectedItems.forEach((id) => {
          if (view.node[id] && view.node[id].ins) {
            if (shiftPressed) {
              deleteInputPin(id)
            } else {
              createInputPin(id)
            }
          }
        })
        break

      case 'KeyO':
        selectedItems.forEach((id) => {
          if (view.node[id] && view.node[id].outs) {
            if (shiftPressed) {
              deleteOutputPin(id)
            } else {
              createOutputPin(id)
            }
          }
        })
        break

      case 'ShiftLeft':
      case 'ShiftRight':
        this.setState({ shiftPressed: true })

        break

      default:
        break
    }

    if (thereAreSelectedNodes && (code.substring(0, 5) === 'Arrow')) {
      dragItems(draggingDelta, selectedNodes)

      if (!dragMoved) { this.setState({ dragMoved: true }) }

      if (!shiftPressed) {
        endDragging(selectedNodes)

        this.setState({
          dragMoved: false,
          dragging: false
        })
      }
    }
  }

  onDocumentKeyup (event: KeyboardEvent) {
    const { code } = event

    switch (code) {
      case 'ShiftLeft':
      case 'ShiftRight':
        this.setState({ shiftPressed: false })
        break

      default:
        break
    }
  }

  onDoubleClick (event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    const pointer = this.getCoordinates(event)

    this.setState({
      pointer,
      showSelector: true
    })
  }

  onMouseDown (event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    this.setState({
      selectedItems: []
    })
  }

  onMouseLeave (event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    const {
      draggedLinkId,
      view
    } = this.state

    const link = Object.assign({}, view.link)

    if (draggedLinkId) delete link[draggedLinkId]

    this.setState({
      dragging: false,
      draggedLinkId: null,
      pointer: null,
      showSelector: false,
      view: Object.assign({}, view, { link })
    })
  }

  onMouseMove (event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    const {
      dragItems
    } = this.props

    const {
      dragging,
      dragMoved,
      pointer,
      selectedItems
    } = this.state

    const nextPointer = this.getCoordinates(event)

    const draggingDelta = {
      x: (pointer ? nextPointer.x - pointer.x : 0),
      y: (pointer ? nextPointer.y - pointer.y : 0)
    }

    if (dragging && (selectedItems.length > 0)) {
      dragItems(draggingDelta, selectedItems)
    }

    if (!dragMoved) {
      this.setState({
        dragMoved: true,
        pointer: nextPointer
      })
    } else {
      this.setState({ pointer: nextPointer })
    }
  }

  onMouseUp (event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    const {
      endDragging
    } = this.props

    const {
      draggedLinkId,
      dragMoved,
      view
    } = this.state

    const selectedNodes = this.selectedNodes()
    const link = Object.assign({}, view.link)

    if (draggedLinkId) {
      delete link[draggedLinkId]

      this.setState({
        draggedLinkId: null,
        pointer: null,
        view: Object.assign({}, view, { link })
      })
    } else {
      if (dragMoved) {
        endDragging(selectedNodes)

        this.setState({
          dragging: false,
          dragMoved: false,
          pointer: null
        })
      } else {
        this.setState({
          dragging: false,
          pointer: null
        })
      }
    }
  }

  onWindowResize (container) {
    return () => {
      const rect = container.getBoundingClientRect()

      const dynamicView = {
        height: rect.height,
        width: rect.width
      }

      this.setState({ dynamicView })
    }
  }

  onWindowScroll () {
    const scroll = {
      x: window.scrollX,
      y: window.scrollY
    }

    this.setState({ scroll })
  }

  selectedNodes () {
    const {
      view,
      selectedItems
    } = this.state

    const selectedNodes = Object.keys(view.node).filter((id) => selectedItems.indexOf(id) > -1)

    return selectedNodes
  }

  selectorCreateNode (node) {
    const {
      createNode
    } = this.props

    const id = createNode(node)

    this.setState({
      selectedItems: [id],
      showSelector: false
    })
  }

  render () {
    const {
      createInputPin,
      createLink,
      createOutputPin,
      deleteInputPin,
      deleteLink,
      deleteNode,
      deleteOutputPin,
      fontSize,
      item,
      model,
      theme,
      updateLink
    } = this.props

    const {
      draggedLinkId,
      pointer,
      dynamicView,
      selectedItems,
      showSelector,
      view
    } = this.state

    const {
      frameBorder,
      fontFamily,
      lineWidth,
      nodeBodyHeight,
      pinSize
    } = theme

    let height = dynamicView.height || view.height
    let width = dynamicView.width || view.width

    // Remove border, otherwise also server side SVGx renders
    // missing the bottom and right border.
    var border = 1 // TODO frameBorder is 1px, make it dynamic
    height = height - (2 * border)
    width = width - (2 * border)

    var Link = item.link.DefaultLink

    var setState = this.setState.bind(this)

    var coordinatesOfLink = (link) => {
      var from = link.from
      var to = link.to

      var x1 = null
      var y1 = null
      var x2 = null
      var y2 = null

      var nodeIds = Object.keys(view.node)
      var idEquals = (x) => (id) => (id === x[0])
      var sourceId = (from ? nodeIds.find(idEquals(from)) : null)
      var targetId = (to ? nodeIds.find(idEquals(to)) : null)

      var computedWidth = null

      if (sourceId) {
        var source = view.node[sourceId]

        if (no(source.outs)) source.outs = {}

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
        var target = view.node[targetId]

        if (no(target.ins)) target.ins = {}

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
        x2 = pointer ? (pointer.x - (pinSize / 2)) : x1
        y2 = pointer ? (pointer.y - pinSize) : y1
      }

      return { x1, y1, x2, y2 }
    }

    var onCreateLink = (link) => {
      var draggedLinkId = createLink(link)

      setState({ draggedLinkId })
    }

    var onUpdateLink = (id, link) => {
      updateLink(id, link)

      var disconnectingLink = (link.to === null)

      if (disconnectingLink) {
        link.id = id

        setState({ draggedLinkId: id })
      } else {
        setState({ draggedLinkId: null })
      }
    }

    /**
     * Bring up selected nodes.
     */

    var selectedFirst = (a, b) => {
      // FIXME it works, but it would be nice if the selected
      // items keep being up after deselection.
      var aIsSelected = (selectedItems.indexOf(a) > -1)
      var bIsSelected = (selectedItems.indexOf(b) > -1)

      if (aIsSelected && bIsSelected) return 0

      if (aIsSelected) return 1
      if (bIsSelected) return -1
    }

    var selectItem = (id) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      var {
        draggedLinkId,
        shiftPressed
      } = this.state

      // Do not select items when releasing a dragging link.

      if (draggedLinkId) {
        delete view.link[draggedLinkId]

        setState({ draggedLinkId: null })

        return
      }

      var selectedItems = this.state.selectedItems.slice(0)

      var index = selectedItems.indexOf(id)

      var itemAlreadySelected = index > -1

      // Shift key allows multiple selection.

      if (shiftPressed) {
        if (itemAlreadySelected) {
          selectedItems.splice(index, 1)
        } else {
          selectedItems.push(id)
        }
      } else {
        if (!itemAlreadySelected) {
          selectedItems = [id]
        }
      }

      setState({
        dragging: true,
        selectedItems
      })
    }

    var startDraggingLinkTarget = (id) => {
      // Remember link source.
      var from = view.link[id].from

      // Delete dragged link so the 'deleteLink' event is triggered.
      deleteLink(id)

      // Create a brand new link, this is the right choice to avoid
      // conflicts, for example the user could start dragging the link
      // target and then drop it again in the same target.
      var draggedLinkId = createLink({ from })
      setState({ draggedLinkId })
    }

    return (
      <svg
        fontFamily={fontFamily}
        fontSize={fontSize}
        height={height}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
        onMouseDown={this.onMouseDown}
        onMouseEnter={ignoreEvent}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        textAnchor='start'
        style={{border: frameBorder}}
        width={width}
      >
        {Object.keys(view.node).sort(selectedFirst).map((id, i) => {
          const node = view.node[id]

          var {
            height,
            ins,
            outs,
            text,
            width,
            x,
            y
          } = node

          const nodeType = item.util.typeOfNode(node)
          const Node = item.node[nodeType]

          return (
            <Node key={i}
              createInputPin={createInputPin}
              createOutputPin={createOutputPin}
              draggedLinkId={draggedLinkId}
              deleteInputPin={deleteInputPin}
              deleteNode={deleteNode}
              deleteOutputPin={deleteOutputPin}
              fontSize={fontSize}
              height={height}
              id={id}
              ins={ins}
              model={model}
              multiSelection={(selectedItems.length > 1)}
              onCreateLink={onCreateLink}
              outs={outs}
              pinSize={pinSize}
              selected={(selectedItems.indexOf(id) > -1)}
              selectNode={selectItem(id)}
              text={text}
              updateLink={onUpdateLink}
              width={width}
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
          const sourceSelected = from ? (selectedItems.indexOf(from[0]) > -1) : false
          const targetSelected = to ? (selectedItems.indexOf(to[0]) > -1) : false

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
              selectLink={selectItem(id)}
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
          createNode={this.selectorCreateNode}
          nodeList={item.nodeList}
          pointer={pointer}
          show={showSelector}
        />
      </svg>
    )
  }
}

/*
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
  endDragging: PropTypes.func.isRequired,
  fontSize: PropTypes.number.isRequired,
  item: PropTypes.shape({
    link: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    nodeList: PropTypes.array.isRequired,
    util: PropTypes.shape({
      typeOfNode: PropTypes.func.isRequired
    })
  }).isRequired,
  selectLink: PropTypes.func.isRequired,
  selectNode: PropTypes.func.isRequired,
//  theme: theme.propTypes,
  updateLink: PropTypes.func.isRequired,
  view: PropTypes.shape({
    height: PropTypes.number.isRequired,
    link: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired
  }).isRequired
}
*/

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
  emitCreateInputPin: Function.prototype,
  emitCreateLink: Function.prototype,
  emitCreateNode: Function.prototype,
  emitCreateOutputPin: Function.prototype,
  emitDeleteInputPin: Function.prototype,
  emitDeleteLink: Function.prototype,
  emitDeleteNode: Function.prototype,
  emitDeleteOutputPin: Function.prototype,
  endDragging: Function.prototype,
  fontSize: 17, // FIXME fontSize seems to be ignored
  item: {
    link: { DefaultLink },
    node: { DefaultNode },
    nodeList: [],
    util: {
      typeOfNode: function (node) {
        return 'DefaultNode'
      }
    }
  },
  theme: defaultTheme,
  updateLink: Function.prototype,
  view: {
    link: {},
    node: {}
  }
}

module.exports = exports.default = Frame
