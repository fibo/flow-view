import { connect } from 'react-redux'
import xCenterOfPin from '../util/xCenterOfPin'
import {
  addLink,
  addNode,
  dragItems,
  dragLink,
  delNode,
  endDraggingItems,
  endDraggingLink,
  hideNodeSelector,
  selectItem,
  setNumIns,
  setNumOuts,
  setNodeSelectorText,
  showNodeSelector
} from '../actions'
import Canvas from '../components/Canvas'

const pinRadius = 6
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

    const ins = node.ins.map(
      (pin, i, ins) => {
        return {
          cx: xCenterOfPin(pinRadius, width, ins.length, i),
          cy: pinRadius,
          r: pinRadius,
          data: ins[i]
        }
      }
    )

    const outs = node.outs.map(
      (pin, i, outs) => {
        return {
          cx: xCenterOfPin(pinRadius, width, outs.length, i),
          cy: height - pinRadius,
          r: pinRadius,
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
        x = node.x + xCenterOfPin(pinRadius, node.width, node.outs.length, position)
        y = node.y + node.height - pinRadius
      }

      // End node.
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
    pinRadius,
    selectedItems: state.selectedItems,
    previousDraggingPoint,
    isDraggingLink,
    isDraggingItems: state.isDraggingItems,
    nodeSelectorX,
    nodeSelectorY,
    nodeSelectorShow,
    nodeSelectorText,
    draggedLinkId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const offset = ownProps.offset

  return {
    addLink: (from, to) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      const previousDraggingPoint = {
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      }

      dispatch(addLink({ from, to }, previousDraggingPoint))
    },
    addNode: (node) => {
      dispatch(addNode(node))
    },
    dragLink: (previousDraggingPoint) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      const draggingDelta = {
        x: e.clientX - offset.x - previousDraggingPoint.x,
        y: e.clientY - offset.y - previousDraggingPoint.y
      }

      dispatch(dragLink(previousDraggingPoint, draggingDelta))
    },
    delNode: (nodeid) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(delNode(nodeid))
    },
    dragItems: (previousDraggingPoint) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      const draggingDelta = {
        x: e.clientX - offset.x - previousDraggingPoint.x,
        y: e.clientY - offset.y - previousDraggingPoint.y
      }

      dispatch(dragItems(previousDraggingPoint, draggingDelta))
    },
    endDraggingLink: (draggedLinkId, link) => (e) => {
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
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      }))
    },
    selectNode: (nodeid) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(selectItem({
        id: nodeid,
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      }))
    },
    setNodeSelectorText: (e) => {
      e.preventDefault()
      e.stopPropagation()

      setNodeSelectorText({
        text: e.target.value
      })
    },
    setNumIns: (nodeid) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(setNumIns({
        nodeid,
        num: e.target.value
      }))
    },
    setNumOuts: (nodeid) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(setNumOuts({
        nodeid,
        num: e.target.value
      }))
    },
    showNodeSelector: (e) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(showNodeSelector({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      }))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas)
