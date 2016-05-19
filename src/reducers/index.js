import { ADD_NODE } from '../actions'
import { addNode } from './nodes'

// Cannot use, as usual,
//
//     import { combineReducers } from 'redux'
//
// cause DEL_NODE need to access to whole state.

export default flowViewApp = (state, action) => {
  switch (action.type) {
    case ADD_NODE:
      return addNode(state, action)
    default:
      return state
}
