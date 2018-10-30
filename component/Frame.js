const bindme = require('bindme')
const pdsp = require('pdsp')
const staticProps = require('static-props')

const Component = require('./Component')
const Creator = require('./Creator')
const InspectorToggle = require('./InspectorToggle')
const Link = require('./Link')
const Node = require('./Node')

const distance = (x1, y1, x2, y2) => (
  Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
)

/**
 * A Frame contains everything inside a Canvas.
 */

class FlowViewFrame extends Component {
  constructor (canvas, dispatch, container) {
    super(canvas, dispatch, container)

    this.linkRef = {}
    this.nodeRef = {}

    // DOM Elements.
    // =================================================================

    const svg = this.createElementNS('svg')
    svg.style.cursor = 'default'

    this.selectedNodesBounds = {}
    const selection = this.createElementNS('rect', svg)
    selection.setAttribute('fill', 'transparent')
    selection.setAttribute('stroke-dasharray', '10 10')

    const linksGroup = this.createElementNS('g', svg)
    const nodesGroup = this.createElementNS('g', svg)

    const creatorContainer = this.createElementNS('foreignObject', svg)
    const creator = new Creator(canvas, dispatch, creatorContainer)

    const inspectorToggleContainer = this.createElementNS('foreignObject', svg)
    const inspectorToggle = new InspectorToggle(canvas, dispatch, inspectorToggleContainer)

    // Static props.
    // ==================================================================

    staticProps(this)({
      linksGroup,
      nodesGroup,
      selection,
      svg
    })

    staticProps(this.component)({
      creator,
      inspectorToggle
    })

    // Event bindings.
    // ==================================================================

    bindme(this,
      'onDblclick',
      'onKeydownDocument',
      'onKeyupDocument',
      'onMousedown',
      'onMouseleave',
      'onMousemove',
      'onMouseup'
    )

    document.addEventListener('keydown', this.onKeydownDocument)
    document.addEventListener('keyup', this.onKeyupDocument)

    svg.addEventListener('dblclick', this.onDblclick)
    svg.addEventListener('mousedown', this.onMousedown)
    svg.addEventListener('mouseleave', this.onMouseleave)
    svg.addEventListener('mouseup', this.onMouseup)
    svg.addEventListener('mousemove', this.onMousemove)
  }

  getCoordinates (event) {
    const { left, top } = this.svg.getBoundingClientRect()

    return {
      x: event.clientX - left,
      y: event.clientY - top
    }
  }

  isCloseToLink (id, x, y) {
    const { linkRef } = this

    const epsilon = 0.4

    const { startX, endX, startY, endY } = linkRef[id]

    const distanceFromEnd = distance(x, y, endX, endY)
    const distanceFromStart = distance(x, y, startX, startY)
    const distanceFromStartToEnd = distance(startX, startY, endX, endY)

    return distanceFromEnd + distanceFromStart < distanceFromStartToEnd + epsilon
  }

  isInsideRectangularSelection (x, y) {
    const { selectedNodesBounds } = this

    if (Object.keys(selectedNodesBounds).length > 0) {
      return (
        (x >= selectedNodesBounds.x1) && (x <= selectedNodesBounds.x2) &&
        (y >= selectedNodesBounds.y1) && (y <= selectedNodesBounds.y2)
      )
    } else {
      return false
    }
  }

  onDblclick (event) {
    const {
      dispatch,
      linkRef
    } = this

    const { creator } = this.component

    const { x, y } = this.cursorCoordinates = this.getCoordinates(event)

    // If it is close to a link, delete it.
    let foundLinkId

    Object.keys(linkRef).forEach(id => {
      // Select only one link.
      if (foundLinkId) return

      if (this.isCloseToLink(id, x, y)) {
        foundLinkId = id
      }
    })

    if (foundLinkId) {
      return dispatch('deleteLink', foundLinkId)
    }

    // Otherwise show creator.
    if (creator.hidden) {
      return dispatch('showCreator', { x, y })
    }
  }

  onKeydownDocument (event) {
    const { dispatch } = this

    switch (event.key) {
      case 'Backspace': dispatch('deleteSelection')
        break

      case 'Escape': dispatch('resetSelection')
        break

      case 'Shift': dispatch('enableMultiSelection')
        break

      default: break
    }
  }

  onKeyupDocument (event) {
    const { dispatch } = this

    switch (event.key) {
      case 'Shift': dispatch('disableMultiSelection')
        break

      default: break
    }
  }

  onMousedown (event) {
    pdsp(event)

    const {
      dispatch,
      linkRef
    } = this

    const { x, y } = this.cursorCoordinates = this.getCoordinates(event)

    if (this.isInsideRectangularSelection(x, y)) {
      return dispatch('startDraggingItems')
    }

    // If it is close to a link, select it.
    let foundLinkId

    Object.keys(linkRef).forEach(id => {
      // Select only one link.
      if (foundLinkId) return

      if (this.isCloseToLink(id, x, y)) {
        foundLinkId = id
      }
    })

    if (foundLinkId) {
      return dispatch('selectLink', foundLinkId)
    }

    // Otherwise reset selection.
    dispatch('resetSelection')
  }

  onMouseleave (event) {
    const { dispatch, draggingItems } = this

    if (draggingItems) {
      dispatch('stopDraggingItems')
    }
  }

  onMousemove (event) {
    const {
      cursorCoordinates,
      dispatch,
      draggingLink,
      draggingItems,
      selectedNodesBounds
    } = this

    if (draggingItems) {
      const nextCursorCoordinates = this.getCoordinates(event)

      let draggingDelta = {
        x: nextCursorCoordinates.x - cursorCoordinates.x,
        y: nextCursorCoordinates.y - cursorCoordinates.y
      }

      // Prevent from dragging outside of left and top canvas borders.
      if (selectedNodesBounds.x1 + draggingDelta.x <= 0) {
        draggingDelta.x = 0
      }

      if (selectedNodesBounds.y1 + draggingDelta.y <= 0) {
        draggingDelta.y = 0
      }

      this.cursorCoordinates = nextCursorCoordinates

      dispatch('dragItems', draggingDelta)
    }

    if (draggingLink) {
      // TODO snap to pin, if link is close to a pin that could be joined
      // set coordinated to that pin.
      dispatch('dragLink', this.getCoordinates(event))
    }
  }

  onMouseup (event) {
    pdsp(event)

    const {
      dispatch,
      draggingLink,
      draggingItems
    } = this

    this.setCursorCoordinates(event)
    const { x, y } = this.cursorCoordinates

    if (draggingItems && this.isInsideRectangularSelection(x, y)) {
      return dispatch('stopDraggingItems')
    }

    if (draggingLink) {
      // TODO check if it is close to a pin
      return dispatch('deleteHalfLink')
    }
  }

  render (state) {
    const {
      canvas,
      dispatch,
      linksGroup,
      nodesGroup,
      selection,
      svg
    } = this

    const {
      currentPin,
      draggingItems,
      draggedLinkCoordinates,
      draggedLinkType,
      draggedLinkId,
      draggingLink,
      graph,
      inspector,
      root,
      textSize
    } = state

    this.draggingItems = draggingItems
    this.draggingLink = draggingLink

    const draggedLink = draggedLinkId ? graph.links.find(link => link.id === draggedLinkId) : null
    this.draggedLink = draggedLink

    const selectedLinks = state.selected.links
    const selectedNodes = state.selected.nodes

    const { fontFamily, fontSize } = canvas.theme.frame
    const halfPinSize = canvas.theme.pin.size / 2

    const height = root.height
    const width = inspector.hidden ? root.width : root.width - inspector.width
    const moreThanOneNodeSelected = (selectedNodes.length > 1)
    const someNodeSelected = (selectedNodes.length > 0)

    const selectedNodesBounds = someNodeSelected ? selectedNodes.map(id => this.nodeRef[id]).reduce((bounds, node) => ({
      x1: Math.min(bounds.x1, node.x),
      y1: Math.min(bounds.y1, node.y),
      x2: Math.max(bounds.x2, node.x + node.width),
      y2: Math.max(bounds.y2, node.y + node.height)
    }), {
      // P1 = (x1, y1) is upper left corner.
      // P2 = (x2, y2) is lower right corner.
      // They are compared with node bounds to get min P1 and max P2.
      // Using Infinity makes sure first node take into account will
      // win the comparison and set its bounds as first value.
      x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity
    }) : {}

    // Changed properties.
    // =================================================================

    const fontChanged = (this.fontSize !== fontSize) || (this.fontFamily !== fontFamily)
    const heightChanged = this.height !== height
    const selectedNodesBoundsChanged = (
      (selectedNodesBounds.x1 !== this.selectedNodesBounds.x1) ||
      (selectedNodesBounds.y1 !== this.selectedNodesBounds.y1) ||
      (selectedNodesBounds.x2 !== this.selectedNodesBounds.x2) ||
      (selectedNodesBounds.y2 !== this.selectedNodesBounds.y2)
    )
    const widthChanged = this.width !== width

    // Font.
    // =================================================================

    if (fontChanged) {
      svg.setAttribute('font-family', fontFamily)
      svg.setAttribute('font-size', fontSize)
    }

    // Frame dimensions.
    // =================================================================

    if (widthChanged) {
      svg.setAttribute('width', width)
    }

    if (heightChanged) {
      svg.setAttribute('height', height)
    }

    // Selected nodes.
    // =================================================================

    if (selectedNodesBoundsChanged) {
      this.selectedNodesBounds = selectedNodesBounds
    }

    // Selection rectangle.
    // =================================================================

    if (moreThanOneNodeSelected) {
      selection.setAttribute('stroke', canvas.theme.selection.color)

      if (selectedNodesBoundsChanged) {
        selection.setAttribute('x', selectedNodesBounds.x1)
        selection.setAttribute('y', selectedNodesBounds.y1)
        selection.setAttribute('height', selectedNodesBounds.y2 - selectedNodesBounds.y1)
        selection.setAttribute('width', selectedNodesBounds.x2 - selectedNodesBounds.x1)
      }
    } else {
      selection.setAttribute('stroke', 'transparent')
    }

    // Remove deleted nodes.
    // =================================================================

    Object.keys(this.nodeRef).forEach(id => {
      if (!graph.nodes.find(node => node.id === id)) {
        nodesGroup.removeChild(this.nodeRef[id].container)

        delete this.nodeRef[id]
      }
    })

    // Compute connected pins.
    // =================================================================

    const connectedIns = {}
    const connectedOuts = {}

    graph.links.forEach(({ from, to }) => {
      if (from) {
        const [ sourceNodeId, sourceNodePosition ] = from

        if (typeof connectedOuts[sourceNodeId] === 'undefined') {
          connectedOuts[sourceNodeId] = [sourceNodePosition]
        } else {
          connectedOuts[sourceNodeId].push(sourceNodePosition)
        }
      }

      if (to) {
        const [ targetNodeId, targetNodePosition ] = to

        if (typeof connectedIns[targetNodeId] === 'undefined') {
          connectedIns[targetNodeId] = [targetNodePosition]
        } else {
          connectedIns[targetNodeId].push(targetNodePosition)
        }
      }
    })

    // Render existing nodes or create new ones.
    // =================================================================

    graph.nodes.forEach(nodeGraph => {
      const { id } = nodeGraph

      const selected = selectedNodes.indexOf(id) > -1

      const nodeState = {
        connectedIns: (connectedIns[id] || []),
        connectedOuts: (connectedOuts[id] || []),
        currentPin: currentPin && currentPin.nodeId === id ? currentPin : null,
        draggedLink,
        draggedLinkType,
        draggingLink,
        graph: nodeGraph,
        selected,
        textSize: textSize[id]
      }

      const nodeRef = this.nodeRef[id]

      if (nodeRef) {
        // Selected nodes on top!
        if (selected && !draggingItems) {
          nodesGroup.removeChild(nodeRef.container)
          nodesGroup.appendChild(nodeRef.container)
        }

        nodeRef.render(nodeState)
      } else {
        const element = this.createElementNS('g', nodesGroup)
        element.setAttribute('id', id)

        const node = new Node(canvas, this, dispatch, element)
        node.render(nodeState)

        this.nodeRef[id] = node
      }
    })

    // Remove deleted links.
    // =================================================================

    Object.keys(this.linkRef).forEach(id => {
      if (!graph.links.find(link => link.id === id)) {
        linksGroup.removeChild(this.linkRef[id].container)

        delete this.linkRef[id]
      }
    })

    // Render existing links or create new ones.
    // =================================================================

    graph.links.forEach(linkGraph => {
      const { id, from, to } = linkGraph

      const sourceNode = from ? this.nodeRef[from[0]] : null
      const targetNode = to ? this.nodeRef[to[0]] : null

      const sourcePin = sourceNode ? sourceNode.getOutRefByPosition(from[1]) : null
      const targetPin = targetNode ? targetNode.getInRefByPosition(to[1]) : null

      const selected = selectedLinks.indexOf(id) > -1

      const linkState = {
        endX: targetPin ? targetNode.x + targetPin.x + halfPinSize : draggedLinkCoordinates.x,
        endY: targetPin ? targetNode.y + halfPinSize : draggedLinkCoordinates.y,
        graph: linkGraph,
        selected: selected || (sourceNode && targetNode && sourceNode.selected && targetNode.selected),
        startX: sourcePin ? sourceNode.x + sourcePin.x + halfPinSize : draggedLinkCoordinates.x,
        startY: sourcePin ? sourceNode.y + sourcePin.y + halfPinSize : draggedLinkCoordinates.y
      }

      const linkRef = this.linkRef[id]

      if (linkRef) {
        linkRef.render(linkState)
      } else {
        const element = this.createElementNS('g', linksGroup)
        element.setAttribute('id', id)

        const link = new Link(canvas, dispatch, element)
        link.render(linkState)

        this.linkRef[id] = link
      }
    })

    this.renderAllSubComponents(state)
  }

  setCursorCoordinates (event) {
    this.cursorCoordinates = this.getCoordinates(event)
  }
}

module.exports = exports.default = FlowViewFrame
