import initialState from '../initialState'
import {
  ADD_NODE,
  DEL_NODE,
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

    default:
      return state
  }
}

export default flowViewApp
