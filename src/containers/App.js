import { connect } from 'react-redux'
import xCoordinateOfPin from '../geometry/xCoordinateOfPin'
import {
  addLink,
  dragItems,
  endDraggingItems,
  selectItem
} from '../actions'
import Canvas from '../components/Canvas'

const halfPinSize = 5
const pinSize = halfPinSize * 2
const fontWidth = 8
const nodeHeight = 40

const mapStateToProps = (state, ownProps) => {
  let nodes = []

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
      if (node.id === link.from[0]) {
        const position = link.from[1] || 0
        x = node.x + xCoordinateOfPin(pinSize, node.width, node.outs.length, position) + halfPinSize
        y = node.y + node.height - halfPinSize
      }

      // End node.
      if (node.id === link.to[0]) {
        const position = link.to[1] || 0
        x2 = node.x + xCoordinateOfPin(pinSize, node.width, node.ins.length, position) + halfPinSize
        y2 = node.y + halfPinSize
      }
    }

    links.push({
      id,
      selected: (state.selectedItems.indexOf(id) > -1),
      x, y,
      x2, y2
    })
  }

  return {
    height: (ownProps.height || state.height),
    width: (ownProps.width || state.width),
    nodes,
    links,
    pinSize,
    selectedItems: state.selectedItems,
    previousDraggingPoint: state.previousDraggingPoint,
    isConnectingLink: state.isConnectingLink
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createLink: (from, to) => (e) => {
      dispatch(addLink(from, to))
    },
    dragItems: (previousDraggingPoint) => (e) => {
      const draggingDelta = {
        x: e.clientX - previousDraggingPoint.x,
        y: e.clientY - previousDraggingPoint.y
      }

      dispatch(dragItems(previousDraggingPoint, draggingDelta))
    },
    endDraggingItems: () => {
      dispatch(endDraggingItems())
    },
    selectNode: (nodeid) => (e) => {
      dispatch(selectItem({
        id: nodeid,
        x: e.clientX,
        y: e.clientY
      }))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas)
