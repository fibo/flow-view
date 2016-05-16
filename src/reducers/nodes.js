import { ADD_NODE } from '../actions'
import defaultState from '../default/state.js'
import Node from '../model/Node'

const nodes = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_NODE:
      const nextState = Object.assign({}, state)

      var node = new Node(action.data)

      nextState.node[node.id] = node.getData()

      return nextState
    default:
      return state
  }
}

export default nodes
