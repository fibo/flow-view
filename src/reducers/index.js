import initialState from '../initialState'
import {
  ADD_NODE,
  DEL_NODE,
  DRAG_ITEMS,
  END_DRAGGING_ITEM,
  SELECT_ITEM,
  START_DRAGGING_ITEM
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

    case END_DRAGGING_ITEM:
      return Object.assign({}, state, {
        isDraggingItems: false,
        startDraggingPoint: null
      })

    case DRAG_ITEMS:
      const draggedNodes = Object.assign({}, state.node)

      for (let nodeid in draggedNodes) {

        if (state.selectedItems.indexOf(nodeid) === -1) {
          continue

        } else {
          draggedNodes[nodeid].x += action.dx
          draggedNodes[nodeid].y += action.dy
        }
      }

      return Object.assign({}, state, {
        node: draggedNodes
      })

    case SELECT_ITEM:
      let selectedItems = Object.assign([], state.selectedItems)
      let itemId = action.id

      const indexOfSelectedItem = selectedItems.indexOf(itemId)
      const itemIsNotAlreadySelected = (indexOfSelectedItem === -1)

      if (itemIsNotAlreadySelected) {
        selectedItems.push(itemId)
      } else {
        selectedItems.splice(indexOfSelectedItem, 1)
      }

      return Object.assign({}, state, { selectedItems })

    case START_DRAGGING_ITEM:
      return Object.assign({}, state, {
        isDraggingItems: true,
        startDraggingPoint: action.startingPoint
      })

    default:
      return state
  }
}

export default flowViewApp
