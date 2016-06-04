import { connect } from 'react-redux'
import xCoordinateOfPin from '../geometry/xCoordinateOfPin'
import {
  addLink,
  dragItems,
  endDraggingItems,
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

  const nodeSelectorShow = (state.nodeSelector !== null)
  let nodeSelectorX = 0
  let nodeSelectorY = 0
  let nodeSelectorText = ''

  if (nodeSelectorShow) {
    nodeSelectorX = state.nodeSelector.x
    nodeSelectorY = state.nodeSelector.y
    nodeSelectorText = state.nodeSelector.text
  }

  return {
    height: (ownProps.height || state.height),
    width: (ownProps.width || state.width),
    nodes,
    links,
    pinSize,
    selectedItems: state.selectedItems,
    previousDraggingPoint: state.previousDraggingPoint,
    isConnectingLink: state.isConnectingLink,
    nodeSelectorX,
    nodeSelectorY,
    nodeSelectorShow,
    nodeSelectorText: nodeSelectorText
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
    hideNodeSelector: () => {
      dispatch(hideNodeSelector())
    },
    selectLink: (linkid) => (e) => {
      dispatch(selectItem({
        id: linkid,
        x: e.clientX,
        y: e.clientY
      }))
    },
    selectNode: (nodeid) => (e) => {
      dispatch(selectItem({
        id: nodeid,
        x: e.clientX,
        y: e.clientY
      }))
    },
    setNodeSelectorText: (e) => {
      setNodeSelectorText({
        text: e.target.value
      })
    },
    showNodeSelector: (e) => {
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
