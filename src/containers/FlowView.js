import { connect } from 'react-redux'
import xCenterOfPin from '../util/xCenterOfPin'
import Canvas from '../components/Canvas'

export function mapStateToProps (state, ownProps) {
  const documentElement = ownProps.documentElement

  const offset = {
    x: documentElement.offsetLeft,
    y: documentElement.offsetTop
  }

  let nodes = []

  let draggedLinkId = state.view.draggedLinkId

  const pinRadius = state.view.pinRadius
  const nodeHeight = state.view.nodeHeight
  const fontWidth = state.view.fontWidth

  const previousDraggingPoint = state.view.previousDraggingPoint

  for (let id in state.view.node) {
    const node = Object.assign({},
      { ins: [], outs: [] },
      state.view.node[id]
    )

    // TODO these two lines are repeated in reducers/index.js, refactor them!
    const height = node.height || nodeHeight
    const width = (node.width || ((node.text.length + 4) * fontWidth))

    const ins = node.ins.map(
      (pin, i, pins) => ({
        cx: xCenterOfPin(pinRadius, width, pins.length, i),
        cy: pinRadius,
        r: pinRadius,
        data: pins[i]
      })
    )

    const outs = node.outs.map(
      (pin, i, pins) => ({
        cx: xCenterOfPin(pinRadius, width, pins.length, i),
        cy: height - pinRadius,
        r: pinRadius,
        data: pins[i]
      })
    )

    nodes.push({
      height,
      id,
      ins,
      outs,
      selected: (state.view.selectedItems.indexOf(id) > -1),
      text: node.text,
      width,
      y: node.y,
      x: node.x
    })
  }

  let links = []

  for (let id in state.view.link) {
    const link = Object.assign({},
      state.view.link[id]
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
      dragged: (draggedLinkId === id),
      id,
      selected: (state.view.selectedItems.indexOf(id) > -1),
      x,
      y,
      x2,
      y2
    })
  }

  const isDraggingLink = (draggedLinkId !== null)

  return {
    height: (ownProps.height || state.view.height),
    width: (ownProps.width || state.view.width),
    nodes,
    links,
    offset,
    pinRadius,
    selectedItems: state.view.selectedItems,
    previousDraggingPoint,
    isDraggingLink,
    isDraggingItems: state.view.isDraggingItems,
    draggedLinkId
  }
}

export default connect(mapStateToProps)(Canvas)
