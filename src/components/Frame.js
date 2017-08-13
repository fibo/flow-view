import React from 'react'
import ReactDOM from 'react-dom'

import bindme from 'bindme'
import no from 'not-defined'

import DefaultLink from './Link'
import DefaultNode from './Node'
import Selector from './Selector'

import computeNodeWidth from '../utils/computeNodeWidth'
import randomString from '../utils/randomString'
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
  FlowView,
  Id,
  NodeIdAndPosition,
  SerializedNode
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
      'createLink',
      'createNode',
      'createInputPin',
      'createOutputPin',
      'deleteInputPin',
      'deleteOutputPin',
      'deleteLink',
      'deleteNode',
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

  createInputPin (nodeId: Id, pin: Pin) {
    const view = Object.assign({}, this.state.view)

    const ins = view.node[nodeId].ins || []

    const position = view.node[nodeId].ins.length

    if (no(pin)) pin = `in${position}`

    ins.push(pin)

    view.node[nodeId].ins = ins

    this.setState({ view })

    this.props.emitCreateInputPin([nodeId, position], pin)
  }

  createLink (link: { from: NodeIdAndPosition, to?: NodeIdAndPosition }) {
    const view = Object.assign({}, this.state.view)

    const id = this.generateId()

    let newLink = {}
    newLink[id] = link

    view.link[id] = link

    this.setState({ view })

    // Fire createLink event only if it is not a dragging link.
    if (link.to) {
      this.props.emitCreateLink(link, id)
    }

    return id
  }

  createNode (node: SerializedNode) {
    const view = Object.assign({}, this.state.view)

    const id = this.generateId()

    view.node[id] = node

    this.setState({ view })

    this.props.emitCreateNode(node, id)

    return id
  }

  createOutputPin (nodeId: Id, pin: Pin) {
    const view = Object.assign({}, this.state.view)

    const outs = view.node[nodeId].outs || []

    const position = view.node[nodeId].outs.length

    if (no(pin)) pin = `out${position}`

    outs.push(pin)

    view.node[nodeId].outs = outs

    this.setState({ view })

    this.props.emitCreateOutputPin([nodeId, position], pin)
  }

  deleteInputPin (nodeId: Id, position?: number) {
    const view = Object.assign({}, this.state.view)

    const ins = view.node[nodeId].ins

    if (no(ins)) return
    if (ins.length === 0) return

    if (no(position)) position = ins.length - 1

     // Look for connected links and delete them.

    Object.keys(view.link).forEach((id) => {
      const to = view.link[id].to

      if (no(to)) return

      if ((to[0] === nodeId) && (to[1] === position)) {
        this.deleteLink(id)
      }
    })

    view.node[nodeId].ins.splice(position, 1)

    this.setState({ view })

    this.props.emitDeleteInputPin([nodeId, position])
  }

  deleteOutputPin (nodeId: Id, position?: number) {
    const view = Object.assign({}, this.state.view)

    const outs = view.node[nodeId].outs

    if (no(outs)) return
    if (outs.length === 0) return

    if (no(position)) position = outs.length - 1

     // Look for connected links and delete them.

    Object.keys(view.link).forEach((id) => {
      const from = view.link[id].from

      if (no(from)) return

      if ((from[0] === nodeId) && (from[1] === position)) {
        this.deleteLink(id)
      }
    })

    view.node[nodeId].outs.splice(position, 1)

    this.setState({ view })

    this.props.emitDeleteOutputPin([nodeId, position])
  }

  deleteLink (id: Id) {
    const view = Object.assign({}, this.state.view)

    delete view.link[id]

    this.setState({ view })

    this.props.emitDeleteLink(id)
  }

  deleteNode (id: Id) {
    const view = Object.assign({}, this.state.view)

    // Delete links connected to given node.
    Object.keys(view.link).forEach((linkId) => {
      const from = view.link[linkId].from
      const to = view.link[linkId].to

      if (from && from[0] === id) {
        this.deleteLink(linkId)
      }

      if (to && to[0] === id) {
        this.deleteLink(linkId)
      }
    })

    delete view.node[id]

    this.setState({ view })

    this.props.emitDeleteNode(id)
  }

  generateId () {
    const {
      view
    } = this.state

    const id = randomString(3)

    return (view.link[id] || view.node[id]) ? this.generateId() : id
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
              this.deleteInputPin(id)
            } else {
              this.createInputPin(id)
            }
          }
        })
        break

      case 'KeyO':
        selectedItems.forEach((id) => {
          if (view.node[id] && view.node[id].outs) {
            if (shiftPressed) {
              this.deleteOutputPin(id)
            } else {
              this.createOutputPin(id)
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
    const id = this.createNode(node)

    this.setState({
      selectedItems: [id],
      showSelector: false
    })
  }

  render () {
    const {
      createLink,
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
              createInputPin={this.createInputPin}
              createLink={this.createLink}
              createOutputPin={this.createOutputPin}
              draggedLinkId={draggedLinkId}
              deleteInputPin={this.deleteInputPin}
              deleteNode={this.deleteNode}
              deleteOutputPin={this.deleteOutputPin}
              fontSize={fontSize}
              height={height}
              id={id}
              ins={ins}
              model={model}
              multiSelection={(selectedItems.length > 1)}
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
              deleteLink={this.deleteLink}
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

Frame.defaultProps = {
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
