import { ADD_NODE } from '../actions'
import { addNode } from './nodes'

const initialState = {
  height: 500,
  width: 500,
  node: {},
  link: {}
}

const flowViewApp = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NODE:
      return addNode(state, action)
    default:
      return state
  }
}

export default flowViewApp
