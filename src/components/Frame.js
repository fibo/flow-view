import React from 'react'
import ReactDOM from 'react-dom'

import bindme from 'bindme'
import no from 'not-defined'

import Link from './Link'
import NodeBase from './Node'
import RectangularSelection from './RectangularSelection'
import Selector from './Selector'

import computeNodeWidth from '../utils/computeNodeWidth'
import randomString from '../utils/randomString'
import xOfPin from '../utils/xOfPin'

import { defaultTheme } from './theme'

export type Props = {
  emit: (string) => void,
  getTypeOfNode: (NodeBase) => string,
  nodeComponent: { DefaultNode: NodeBase },
  nodeList?: Array<string>,
  theme: Theme,
  view: FlowView
} & Area

type State = {
  draggedLinkId: ?LinkId,
  isMouseDown: boolean,
  isMouseDraggingItems: boolean,
  offset: Point,
  pointer: ?Point,
  rectangularSelection: ?Rectangle,
  scroll: Point,
  showSelector: boolean,
  selectedItems: Array,
  shiftPressed: boolean,
  view: {
    link: { [LinkId]: SerializedLink },
    node: { [NodeId]: SerializedNode }
  }
}

export default class FlowViewFrame extends React.Component<Props, State> {
  link: Map<LinkId, SerializedLink>
  node: Map<NodeId, SerializedNode>
  nodeRef: Map<NodeId, NodeBase>

  static defaultProps = {
    emit: Function.prototype,
    getTypeOfNode: () => 'DefaultNode',
    nodeList: [],
    nodeComponent: { DefaultNode: NodeBase },
    theme: defaultTheme,
    view: {
      links: [],
      nodes: []
    }
  }

  constructor (props: Props) {
    bindme(super(props),
      'connectLinkToTarget',
      'createLink',
      'createNode',
      'createInputPin',
      'createOutputPin',
      'deleteInputPin',
      'deleteOutputPin',
      'deleteLink',
      'deleteNode',
      'onDocumentKeydown',
      'onDocumentKeyup',
      'onDoubleClick',
      'onMouseDown',
      'onMouseEnter',
      'onMouseLeave',
      'onMouseMove',
      'onMouseUp',
      'onWindowScroll',
      'selectorCreateNode',
      'selectItem',
      'startDraggingLinkTarget'
     )

    const {
      width,
      height,
      view
    } = props

    let linkCollection = {}

    view.links.forEach(link => {
      linkCollection[link.id] = link
    })

    let nodeCollection = {}

    view.nodes.forEach(node => {
      nodeCollection[node.id] = node
    })

    this.state = {
      draggedLinkId: null,
      height,
      isMouseDown: false,
      isMouseDraggingItems: false,
      offset: { x: 0, y: 0 },
      pointer: null,
      rectangularSelection: null,
      scroll: { x: 0, y: 0 },
      showSelector: false,
      selectedItems: [],
      shiftPressed: false,
      view: {
        link: linkCollection,
        node: nodeCollection
      },
      width
    }

    this.nodeRef = new Map()
  }

  componentDidMount () {
    const DOMNode = ReactDOM.findDOMNode(this)

    if (DOMNode) {
      const container = ReactDOM.findDOMNode(this).parentNode

      if (container) {
        document.addEventListener('keydown', this.onDocumentKeydown)
        document.addEventListener('keyup', this.onDocumentKeyup)

        window.addEventListener('scroll', this.onWindowScroll)

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
    }
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.onDocumentKeydown)
    document.removeEventListener('keyup', this.onDocumentKeyup)

    window.removeEventListener('scroll', this.onWindowScroll)
  }

  connectLinkToTarget (linkId: LinkId, target: NodeIdAndPinPosition): void {
    const view = Object.assign({}, this.state.view)

    view.link[linkId].to = target

    this.setState({
      draggedLinkId: null,
      view
    })
  }

  coordinatesOfLink ({ from, to }: SerializedLink): Segment {
    const { theme } = this.props

    const {
      pointer,
      view
    } = this.state

    const fontSize = theme.frame.font.size

    const nodeBodyHeight = theme.node.body.height
    const pinSize = theme.node.pin.size

    let x1
    let y1
    let x2
    let y2

    const nodeIds = Object.keys(view.node)
    const idEquals = (x) => (id) => (id === x[0])
    const sourceId = (from ? nodeIds.find(idEquals(from)) : null)
    const targetId = (to ? nodeIds.find(idEquals(to)) : null)

    let computedWidth = null

    if (sourceId) {
      const source = view.node[sourceId]

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
      // it should be revisioned when implementing creating links
      // in the opposite direction.
      x2 = pointer ? (pointer.x - (pinSize / 2)) : x1
      y2 = pointer ? (pointer.y - pinSize) : y1
    }

    return { x1, y1, x2, y2 }
  }

  createInputPin (
    nodeId: NodeId,
    pin: ?SerializedPin,
    emit: ?boolean = false
  ): SerializedPin & NodeIdAndPinPosition {
    const view = Object.assign({}, this.state.view)

    const ins = view.node[nodeId].ins || []

    const position = ins.length

    const nodeIdAndPinPosition = { nodeId, position }

    if (no(pin)) pin = { name: `in${position}` }

    ins.push(pin)

    view.node[nodeId].ins = ins

    this.setState({ view })

    if (emit) {
      this.props.emit('createInputPin', nodeIdAndPinPosition, pin)
    }

    return Object.assign({}, nodeIdAndPinPosition, pin)
  }

  createLink (link: SemiLink): LinkId {
    const view = Object.assign({}, this.state.view)

    const id = this.generateId()

    let newLink = {}
    newLink[id] = link

    view.link[id] = link

    // Fire createLink event only if it is not a dragging link.
    if (link.to) {
      this.setState({
        draggedLinkId: null,
        selectedItems: [],
        view
      })
      this.props.emit('createLink', link, id)
    } else {
      this.setState({
        draggedLinkId: id,
        isMouseDown: true,
        selectedItems: [],
        view
      })
    }

    return id
  }

  createNode (node: SerializedNode): NodeId {
    const view = Object.assign({}, this.state.view)

    const id = this.generateId()

    view.node[id] = node

    this.setState({ view })

    return id
  }

  createOutputPin (
    nodeId: NodeId,
    pin: ?SerializedPin,
    emit: ?boolean = false
  ): SerializedPin & NodeIdAndPinPosition {
    const view = Object.assign({}, this.state.view)

    const outs = view.node[nodeId].outs || []

    const position = outs.length

    const nodeIdAndPinPosition = { nodeId, position }

    if (no(pin)) pin = { name: `out${position}` }

    outs.push(pin)

    view.node[nodeId].outs = outs

    this.setState({ view })

    if (emit) {
      this.props.emit('createOutputPin', nodeIdAndPinPosition, pin)
    }

    return Object.assign({}, nodeIdAndPinPosition, pin)
  }

  deleteInputPin (nodeId: NodeId, position: ?number): void {
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
  }

  deleteOutputPin (nodeId: NodeId, position?: number): void {
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
  }

  deleteLink (id: LinkId): void {
    const view = Object.assign({}, this.state.view)

    delete view.link[id]

    this.setState({ view })
  }

  deleteNode (id: NodeId): void {
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
    this.nodeRef.delete(id)

    this.setState({ view })
  }

  dragItems (dragginDelta: Point, draggedItems: Array<LinkId | NodeId>): void {
    const view = Object.assign({}, this.state.view)

    Object
    .keys(view.node)
    .filter((id) => (draggedItems.indexOf(id) > -1))
    .forEach((id) => {
      view.node[id].x += dragginDelta.x
      view.node[id].y += dragginDelta.y
    })

    this.setState({ view })
  }

  emitUpdateNodesGeometry () {
    this.props.emit('updateNodeGeometry', this.selectedNodes())
  }

  generateId (): LinkId | NodeId {
    const { view } = this.state

    const id = randomString(3)

    return (view.link[id] || view.node[id]) ? this.generateId() : id
  }

  getCoordinates (event: MouseEvent): Point {
    const {
      offset,
      scroll
    } = this.state

    return {
      x: event.clientX - offset.x + scroll.x,
      y: event.clientY - offset.y + scroll.y
    }
  }

  onDocumentKeydown (event: KeyboardEvent): void {
    const { code } = event

    const {
      selectedItems,
      shiftPressed,
      view
    } = this.state

    const isArrowCode = (code.substring(0, 5) === 'Arrow')

    const selectedLinks = this.selectedLinks()
    const thereAreSelectedLinks = (selectedLinks.length > 0)

    const selectedNodeIds = this.selectedNodeIds()
    const thereAreSelectedNodes = (selectedNodeIds.length > 0)

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

      case 'Backspace':
        if (thereAreSelectedLinks) {
          selectedLinks.forEach(this.deleteLink)
        }

        if (thereAreSelectedNodes) {
          selectedNodeIds.forEach(this.deleteNode)
        }

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

    if (thereAreSelectedNodes && isArrowCode) {
      this.dragItems(draggingDelta, selectedNodeIds)

      if (!shiftPressed) this.emitUpdateNodesGeometry()
    }
  }

  onDocumentKeyup (event: KeyboardEvent) {
    const { code } = event

    const selectedNodeIds = this.selectedNodeIds()
    const thereAreSelectedNodes = (selectedNodeIds.length > 0)

    switch (code) {
      case 'ShiftLeft':
      case 'ShiftRight':
        if (thereAreSelectedNodes) this.emitUpdateNodesGeometry()

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

    const pointer = this.getCoordinates(event)

    this.setState({
      isMouseDown: true,
      rectangularSelection: {
        x: pointer.x,
        y: pointer.y,
        height: 0,
        width: 0
      },
      selectedItems: [],
      showSelector: false
    })
  }

  onMouseEnter (event: MouseEvent): void { event.stopPropagation() }

  onMouseLeave (event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()

    const {
      draggedLinkId,
      view
    } = this.state

    const link = Object.assign({}, view.link)

    if (draggedLinkId) delete link[draggedLinkId]

    this.setState({
      draggedLinkId: null,
      isMouseDown: false,
      rectangularSelection: null,
      view: Object.assign({}, view, { link })
    })
  }

  onMouseMove (event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    const {
      isMouseDown,
      pointer,
      rectangularSelection,
      selectedItems
    } = this.state

    if (!isMouseDown) return

    const nextPointer = this.getCoordinates(event)

    const draggingDelta = {
      x: (pointer ? nextPointer.x - pointer.x : 0),
      y: (pointer ? nextPointer.y - pointer.y : 0)
    }

    if (selectedItems.length > 0) {
      this.dragItems(draggingDelta, selectedItems)
    }

    if (rectangularSelection) {
      this.setState({
        pointer: nextPointer,
        rectangularSelection: Object.assign({},
          rectangularSelection,
          {
            height: nextPointer.y - rectangularSelection.y,
            width: nextPointer.x - rectangularSelection.x
          })
      })
    } else {
      this.setState({
        isMouseDraggingItems: true,
        pointer: nextPointer
      })
    }
  }

  onMouseUp (event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()

    const {
      draggedLinkId,
      rectangularSelection
    } = this.state

    const view = Object.assign({}, this.state.view)

    if (draggedLinkId) {
      delete view.link[draggedLinkId]

      this.setState({
        draggedLinkId: null,
        isMouseDown: false,
        pointer: null,
        rectangularSelection: null,
        selectedItems: [],
        view: Object.assign({}, view)
      })

      return
    }

    const isInside = (rectangularSelection) => (x, y) => {
      // Consider when rectangular selection is reflected.
      const boundsX = rectangularSelection.width >= 0 ? rectangularSelection.x : rectangularSelection.x + rectangularSelection.width
      const boundsY = rectangularSelection.height >= 0 ? rectangularSelection.y : rectangularSelection.y + rectangularSelection.height

      // TODO fix reflected selection.
      // console.log(x, y, boundsX, boundsY)

      return (
        (x >= boundsX) && (x <= boundsX + rectangularSelection.width) &&
        (y >= boundsY) && (y <= boundsY + rectangularSelection.height)
      )
    }

    if (rectangularSelection) {
      let selectedItems = []

      Object.keys(view.node).forEach((nodeId) => {
        const { x, y } = view.node[nodeId]

        // TODO Check every node vertex. Would need node height and width.
        const nodeIsInside = (
          isInside(rectangularSelection)(x, y)
        )

        if (nodeIsInside) {
          selectedItems.push(nodeId)
        }
      })

      this.setState({
        draggedLinkId: null,
        isMouseDown: false,
        pointer: null,
        selectedItems,
        rectangularSelection: null
      })

      return
    }

    const selectedNodeIds = this.selectedNodeIds()
    const thereAreSelectedNodes = (selectedNodeIds.length > 0)

    if (thereAreSelectedNodes) this.emitUpdateNodesGeometry()

    this.setState({
      draggedLinkId: null,
      isMouseDown: false,
      isMouseDraggingItems: false,
      pointer: null
    })
  }

  onWindowScroll (): void {
    const scroll = {
      x: window.scrollX,
      y: window.scrollY
    }

    this.setState({ scroll })
  }

  selectedLinks (): Array<LinkId> {
    const {
      view,
      selectedItems
    } = this.state

    const selectedLinks = Object.keys(view.link).filter((id) => selectedItems.indexOf(id) > -1)

    return selectedLinks
  }

  selectedNodeIds (): Array<NodeId> {
    const {
      view,
      selectedItems
    } = this.state

    const selectedNodeIds = Object.keys(view.node).filter((id) => selectedItems.indexOf(id) > -1)

    return selectedNodeIds
  }

  selectedNodes (): { [NodeId]: SerializedNode } {
    const { view } = this.state

    let selectedNodes = {}

    const selectedNodeIds = this.selectedNodeIds()

    selectedNodeIds.forEach(id => {
      selectedNodes[id] = Object.assign({}, view.node[id])
    })

    return selectedNodes
  }

  selectorCreateNode (node: SerializedNode): void {
    const id = this.createNode(node)

    this.setState({
      selectedItems: [id],
      showSelector: false
    })
  }

  render () {
    const {
      getTypeOfNode,
      height,
      nodeComponent,
      nodeList,
      theme,
      width
    } = this.props

    const {
      draggedLinkId,
      pointer,
      rectangularSelection,
      selectedItems,
      showSelector,
      view
    } = this.state

    const backgroundColor = theme.frame.color.background
    const primaryColor = theme.frame.color.primary

    const fontFamily = theme.frame.font.family
    const fontSize = theme.frame.font.size
    const pinSize = theme.node.pin.size

    /**
     * Bring up selected nodes.
     */

    const selectedFirst = (a: NodeId, b: NodeId): number => {
      // FIXME it works, but it would be nice if the selected
      // items keep being up after deselection.
      const aIsSelected = (selectedItems.indexOf(a) > -1)
      const bIsSelected = (selectedItems.indexOf(b) > -1)

      if (aIsSelected && bIsSelected) return 0

      if (aIsSelected) return 1
      if (bIsSelected) return -1

      return 0
    }

    return (
      <svg
        fontFamily={fontFamily}
        fontSize={fontSize}
        onDoubleClick={this.onDoubleClick}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        textAnchor='start'
        style={{ backgroundColor }}
        viewBox={`0 0 ${width} ${height}`}
      >
        {rectangularSelection ? (
          <RectangularSelection
            color={primaryColor}
            {...rectangularSelection}
          />
        ) : null}
        {Object.keys(view.link).map((id, i) => {
          const {
            from,
            to
          } = view.link[id]

          const coord = this.coordinatesOfLink(view.link[id])
          const sourceSelected = from ? (selectedItems.indexOf(from[0]) > -1) : false
          const targetSelected = to ? (selectedItems.indexOf(to[0]) > -1) : false

          return (
            <Link key={i}
              deleteLink={this.deleteLink}
              from={from}
              id={id}
              createLink={this.createLink}
              startDraggingLinkTarget={this.startDraggingLinkTarget}
              pinSize={pinSize}
              selected={(selectedItems.indexOf(id) > -1)}
              selectLink={this.selectItem(id)}
              sourceSelected={sourceSelected}
              targetSelected={targetSelected}
              theme={theme}
              to={to}
              x1={coord.x1}
              y1={coord.y1}
              x2={coord.x2}
              y2={coord.y2}
            />
          )
        })}
        {Object.keys(view.node).sort(selectedFirst).map((id, i) => {
          const node = view.node[id]

          var {
            ins,
            outs,
            text,
            width,
            x,
            y
          } = node

          const nodeType = getTypeOfNode(node)
          const Node = nodeComponent[nodeType]

          return (
            <Node key={i}ref={node => { this.nodeRef.set(id, node) }}
              connectLinkToTarget={this.connectLinkToTarget}
              createInputPin={this.createInputPin}
              createLink={this.createLink}
              createOutputPin={this.createOutputPin}
              draggedLinkId={draggedLinkId}
              deleteInputPin={this.deleteInputPin}
              deleteNode={this.deleteNode}
              deleteOutputPin={this.deleteOutputPin}
              id={id}
              ins={ins}
              multiSelection={(selectedItems.length > 1)}
              outs={outs}
              pinSize={pinSize}
              selected={(selectedItems.indexOf(id) > -1)}
              selectNode={this.selectItem(id)}
              text={text}
              theme={theme}
              width={width}
              x={x}
              y={y}
            />
          )
        })}
        <Selector
          createNode={this.selectorCreateNode}
          nodeList={nodeList}
          pointer={showSelector ? pointer : null}
          show={showSelector}
          theme={theme}
        />
      </svg>
    )
  }

  selectItem (id: LinkId | NodeId): (MouseEvent) => void {
    return (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const {
        draggedLinkId,
        shiftPressed
      } = this.state

      let selectedItems = [...this.state.selectedItems]
      let view = Object.assign({}, this.state.view)

      const pointer = this.getCoordinates(event)

      // Do not select items when releasing a dragging link.

      if (draggedLinkId) {
        delete view.link[draggedLinkId]

        this.setState({
          draggedLinkId: null,
          view
        })

        return
      }

      const index = selectedItems.indexOf(id)

      const itemAlreadySelected = index > -1

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

      this.setState({
        isMouseDown: true,
        pointer,
        selectedItems,
        showSelector: false
      })
    }
  }

  startDraggingLinkTarget (id: LinkId): void {
    // Remember link source.
    const { from } = this.state.view.link[id]

    // Delete dragged link so the 'deleteLink' event is triggered.
    this.deleteLink(id)

    // Create a brand new link, this is the right choice to avoid
    // conflicts, for example the user could start dragging the link
    // target and then drop it again in the same target.
    const draggedLinkId = this.createLink({ from })

    this.setState({ draggedLinkId })
  }
}
