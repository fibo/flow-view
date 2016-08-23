import { connect } from 'react-redux'
import xCenterOfPin from '../util/xCenterOfPin'
import Canvas from '../components/Canvas'

export function mapStateToProps (state, ownProps) {
  const container = ownProps.container

  const offset = {
    x: container.offsetLeft,
    y: container.offsetTop
  }

  let nodes = []

  let draggedLinkId = state.draggedLinkId

  const pinRadius = state.pinRadius
  const nodeHeight = state.nodeHeight
  const fontWidth = state.fontWidth

  const previousDraggingPoint = state.previousDraggingPoint

  for (let id in state.node) {
    const node = Object.assign({},
      { ins: [], outs: [] },
      state.node[id]
    )

    // TODO these two lines are repeated in reducers/index.js, refactor them!
    const height = node.height || nodeHeight
    const width = (node.width || ((node.text.length + 4) * fontWidth))

    const ins = node.ins.map(
      (pin, i, pins) => {
        return {
          cx: xCenterOfPin(pinRadius, width, pins.length, i),
          cy: pinRadius,
          r: pinRadius,
          data: pins[i]
        }
      }
    )

    const outs = node.outs.map(
      (pin, i, pins) => {
        console.log(pins.length)
        return {
          cx: xCenterOfPin(pinRadius, width, pins.length, i),
          cy: height - pinRadius,
          r: pinRadius,
          data: pins[i]
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

  if (nodeSelectorShow) {
    nodeSelectorX = state.nodeSelector.x
    nodeSelectorY = state.nodeSelector.y
  }

  const isDraggingLink = (draggedLinkId !== null)

  return {
    height: (ownProps.height || state.height),
    width: (ownProps.width || state.width),
    nodes,
    links,
    offset,
    pinRadius,
    selectedItems: state.selectedItems,
    previousDraggingPoint,
    isDraggingLink,
    isDraggingItems: state.isDraggingItems,
    nodeSelectorX,
    nodeSelectorY,
    nodeSelectorShow,
    draggedLinkId
  }
}

export default connect(
  mapStateToProps
)(Canvas)
