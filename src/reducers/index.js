import initialState from '../initialState'
import {
  ADD_NODE,
  DEL_NODE,
  DRAG_ITEMS,
  END_DRAGGING_ITEMS,
  SELECT_ITEM
} from '../actions'

let nextId = 0

const generateId = () => {
  nextId++
  return `id${nextId}`
}

const flowViewApp = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NODE:
      const id = generateId()

      let node = Object.assign({}, state.node)

      node[id] = action.node

      return Object.assign({node}, state)

    case DEL_NODE:
      const nextState = Object.assign({}, state)

      const nodeid = action.id

      delete nextState.node[nodeid]

      for (let linkid in nextState.link) {
        const isSource = nextState.link[linkid].from[0] === nodeid
        const isTarget = nextState.link[linkid].to[0] === nodeid

        if (isSource || isTarget) delete nextState.link[linkid]
      }

      return nextState

    case DRAG_ITEMS:
      const dx = action.draggingDelta.x
      const dy = action.draggingDelta.y

      // TODO const draggedLinks
      const draggedNodes = Object.assign({}, state.node)
        let previousDraggingPoint = {
          x: state.previousDraggingPoint.x + dx,
          y: state.previousDraggingPoint.y + dy
        }

      for (let nodeid in draggedNodes) {
        const isDraggedNode = (state.selectedItems.indexOf(nodeid) === -1)

        if (isDraggedNode) {
          continue
        } else {
          draggedNodes[nodeid].x += dx
          draggedNodes[nodeid].y += dy
        }
      }

      console.log(action.draggingDelta)
      console.log(action.previousDraggingPoint)
      return Object.assign({}, state, {
        node: draggedNodes,
        previousDraggingPoint
      })

    case END_DRAGGING_ITEMS:
      return Object.assign({}, state, {
        isDraggingItems: false,
        previousDraggingPoint: null
      })

    case SELECT_ITEM:
      let selectedItems = []

      if (state.multipleSelection) {
        selectedItems.concat(Object.assign([], state.selectedItems))
      }

      let itemId = action.id

      const indexOfSelectedItem = selectedItems.indexOf(itemId)
      const itemIsNotAlreadySelected = (indexOfSelectedItem === -1)

      if (itemIsNotAlreadySelected) {
        selectedItems.push(itemId)
      } else {
        selectedItems.splice(indexOfSelectedItem, 1)
      }

      return Object.assign({}, state, {
        isDraggingItems: true,
        previousDraggingPoint: {
          x: action.x,
          y: action.y
        },
        selectedItems
      })

    default:
      return state
  }
}

export default flowViewApp
