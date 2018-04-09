const bindme = require('bindme')
const pdsp = require('pdsp')
const staticProps = require('static-props')

const SvgComponent = require('./SvgComponent')
const Creator = require('./Creator')
const InspectorToggle = require('./InspectorToggle')
const Link = require('./Link')
const Node = require('./Node')

/**
 * A Frame contains everything inside a Canvas.
 */

class FlowViewFrame extends SvgComponent {
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
      'onDocumentKeydown',
      'onDocumentKeyup',
      'onDblclick',
      'onMousedown',
      'onMouseleave',
      'onMousemove',
      'onMouseup'
    )

    document.addEventListener('keydown', this.onDocumentKeydown)
    document.addEventListener('keyup', this.onDocumentKeyup)

    svg.addEventListener('dblclick', this.onDblclick)
    svg.addEventListener('mousedown', this.onMousedown)
    svg.addEventListener('mouseleave', this.onMouseleave)
    svg.addEventListener('mouseup', this.onMouseup)
    svg.addEventListener('mousemove', this.onMousemove)
  }

  getCoordinates (event) {
    const { left, top } = this.container.getBoundingClientRect()

    return {
      x:  event.clientX - left,
      y: event.clientY - top
    }
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

  onDocumentKeydown (event) {
    const { dispatch } = this

    switch (event.key) {
      case 'Escape': dispatch('resetSelection')
        break

      case 'Shift': dispatch('enableMultiSelection')
        break

      default: break
    }
  }

  onDocumentKeyup (event) {
    const { dispatch } = this

    switch (event.key) {
      case 'Shift': dispatch('disableMultiSelection')
        break

      default: break
    }
  }

  onDblclick (event) {
    const { dispatch } = this

    const { creator } = this.component

    if (creator.hidden) {
      dispatch('showCreator', this.getCoordinates(event))
    }
  }

  onMousedown (event) {
    pdsp(event)

    const { dispatch } = this

    const { x, y } = this.cursorCoordinates = this.getCoordinates(event)

    if (this.isInsideRectangularSelection(x, y)) {
      dispatch('startDraggingItems')
    } else {
      dispatch('resetSelection')
    }
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
      draggingItems
    } = this

    if (draggingItems) {
      const nextCursorCoordinates = this.getCoordinates(event)

      const draggingDelta = {
        x: nextCursorCoordinates.x - cursorCoordinates.x,
        y: nextCursorCoordinates.y - cursorCoordinates.y
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
      dispatch('stopDraggingItems')
    }

    if (draggingLink) {
      // TODO check if it is close to a pin
      dispatch('deleteHalfLink')
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

    const draggedLink = draggedLinkId ? state.graph.links.find(link => link.id === draggedLinkId) : null
    this.draggedLink = draggedLink

    const selectedNodes = state.selected.nodes

    const { fontFamily, fontSize } = canvas.theme.frame
    const halfPinSize = canvas.theme.pin.size / 2

    const height = root.height
    const width = inspector.hidden ? root.width : root.width - inspector.width
    const thereAreSelectedNodes = (selectedNodes.length > 0)

    const selectedNodesBounds = {}

    selectedNodes.forEach(id => {
      const node = this.nodeRef[id]

      if (selectedNodesBounds.x1) {
        selectedNodesBounds.x1 = Math.min(selectedNodesBounds.x1, node.x)
      } else {
        selectedNodesBounds.x1 = node.x
      }

      if (selectedNodesBounds.y1) {
        selectedNodesBounds.y1 = Math.min(selectedNodesBounds.y1, node.y)
      } else {
        selectedNodesBounds.y1 = node.y
      }

      if (selectedNodesBounds.x2) {
        selectedNodesBounds.x2 = Math.max(selectedNodesBounds.x2, node.x + node.width)
      } else {
        selectedNodesBounds.x2 = node.x + node.width
      }

      if (selectedNodesBounds.y2) {
        selectedNodesBounds.y2 = Math.max(selectedNodesBounds.y2, node.y + node.height)
      } else {
        selectedNodesBounds.y2 = node.y + node.height
      }
    })

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
    const thereAreSelectedNodesChanged = this.thereAreSelectedNodes !== thereAreSelectedNodes
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

    // Selection rectangle.
    // =================================================================

    if (thereAreSelectedNodesChanged) {
      this.thereAreSelectedNodes = thereAreSelectedNodes

      if (thereAreSelectedNodes) {
        selection.setAttribute('stroke', canvas.theme.selection.color)
      } else {
        this.selectedNodesBounds = {}
        selection.setAttribute('stroke', 'transparent')
      }
    }

    if (selectedNodesBoundsChanged) {
      this.selectedNodesBounds = selectedNodesBounds

      if (thereAreSelectedNodes) {
        selection.setAttribute('x', selectedNodesBounds.x1)
        selection.setAttribute('y', selectedNodesBounds.y1)
        selection.setAttribute('height', selectedNodesBounds.y2 - selectedNodesBounds.y1)
        selection.setAttribute('width', selectedNodesBounds.x2 - selectedNodesBounds.x1)
      }
    }

    // TODO Remove deleted nodes.

    // Compute connected pins.
    // =================================================================

    const connectedIns = {}
    const connectedOuts = {}

    state.graph.links.forEach(({ from, to }) => {
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
    //= =================================================================

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

      const linkState = {
        endX: targetPin ? targetNode.x + targetPin.x + halfPinSize : draggedLinkCoordinates.x,
        endY: targetPin ? targetNode.y + halfPinSize : draggedLinkCoordinates.y,
        graph: linkGraph,
        selected: sourceNode && targetNode && sourceNode.selected && targetNode.selected,
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
module.exports = FlowViewFrame
