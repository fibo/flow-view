import { connect } from 'react-redux'
import xCoordinateOfPin from '../geometry/xCoordinateOfPin'
import {
  addLink,
  dragItems,
  dragLink,
  endDraggingItems,
  endDraggingLink,
  hideNodeSelector,
  selectItem,
  setNodeSelectorText,
  showNodeSelector
} from '../actions'
import Canvas from '../components/Canvas'

const halfPinSize = 5
const pinSize = halfPinSize * 2
const fontWidth = 8
const nodeHeight = 40

const mapStateToProps = (state, ownProps) => {
  let nodes = []

  let draggedLinkId = state.draggedLinkId

  const previousDraggingPoint = state.previousDraggingPoint

  for (let id in state.node) {
    const node = Object.assign({},
      { ins: [], outs: [] },
      state.node[id]
    )

    const height = node.height || nodeHeight
    const width = (node.width || ((node.text.length + 4) * fontWidth))

    const selected = (state.selectedItems.indexOf(id) > -1)

    const ins = node.ins.map(
      (pin, i, ins) => {
        return {
          x: xCoordinateOfPin(pinSize, width, ins.length, i),
          y: 0,
          width: pinSize,
          height: pinSize,
          data: ins[i]
        }
      }
    )

    const outs = node.outs.map(
      (pin, i, outs) => {
        return {
          x: xCoordinateOfPin(pinSize, width, outs.length, i),
          y: height - pinSize,
          width: pinSize,
          height: pinSize,
          data: outs[i]
        }
      }
    )

    nodes.push({
      id,
      x: node.x,
      y: node.y,
      text: node.text,
      width, height,
      dragged: (selected && state.isDraggingItems),
      ins,
      outs,
      selected: (state.selectedItems.indexOf(id) > -1)
    })
  }

  let links = []

  for (let id in state.link) {
    const link = Object.assign({},
      state.link[id]
    )

    let x = null
    let y = null
    let x2 = null
    let y2 = null

    for (let node of nodes) {
      // Start node.
      if ((Array.isArray(link.from)) && (node.id === link.from[0])) {
        const position = link.from[1] || 0
        x = node.x + xCoordinateOfPin(pinSize, node.width, node.outs.length, position) + halfPinSize
        y = node.y + node.height - halfPinSize
      }

      // End node.
      if ((Array.isArray(link.to)) && (node.id === link.to[0])) {
        const position = link.to[1] || 0
        x2 = node.x + xCoordinateOfPin(pinSize, node.width, node.ins.length, position) + halfPinSize
        y2 = node.y + halfPinSize
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
      id,
      selected: (state.selectedItems.indexOf(id) > -1),
      dragged: (draggedLinkId === id),
      x, y,
      x2, y2
    })
  }

  const nodeSelectorShow = (state.nodeSelector !== null)
  let nodeSelectorX = 0
  let nodeSelectorY = 0
  let nodeSelectorText = ''

  if (nodeSelectorShow) {
    nodeSelectorX = state.nodeSelector.x
    nodeSelectorY = state.nodeSelector.y
    nodeSelectorText = state.nodeSelector.text
  }

  const isDraggingLink = (draggedLinkId !== null)

  return {
    height: (ownProps.height || state.height),
    width: (ownProps.width || state.width),
    nodes,
    links,
    pinSize,
    selectedItems: state.selectedItems,
    previousDraggingPoint,
    isDraggingLink,
    nodeSelectorX,
    nodeSelectorY,
    nodeSelectorShow,
    nodeSelectorText,
    draggedLinkId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addLink: (from, to) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      const previousDraggingPoint = {
        x: e.clientX,
        y: e.clientY
      }

      dispatch(addLink({ from, to }, previousDraggingPoint))
    },
    dragLink: (previousDraggingPoint) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      const draggingDelta = {
        x: e.clientX - previousDraggingPoint.x,
        y: e.clientY - previousDraggingPoint.y
      }

      dispatch(dragLink(previousDraggingPoint, draggingDelta))
    },
    dragItems: (previousDraggingPoint) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      const draggingDelta = {
        x: e.clientX - previousDraggingPoint.x,
        y: e.clientY - previousDraggingPoint.y
      }

      dispatch(dragItems(previousDraggingPoint, draggingDelta))
    },
    endDraggingLink: (draggedLinkId) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(endDraggingLink(draggedLinkId))
    },
    endDraggingItems: (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(endDraggingItems())
    },
    hideNodeSelector: (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(hideNodeSelector())
    },
    selectLink: (linkid) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(selectItem({
        id: linkid,
        x: e.clientX,
        y: e.clientY
      }))
    },
    selectNode: (nodeid) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(selectItem({
        id: nodeid,
        x: e.clientX,
        y: e.clientY
      }))
    },
    setNodeSelectorText: (e) => {
      e.preventDefault()
      e.stopPropagation()

      setNodeSelectorText({
        text: e.target.value
      })
    },
    showNodeSelector: (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(showNodeSelector({
        x: e.clientX - 10,
        y: e.clientY - 10
      }))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas)
