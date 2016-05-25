import defaultState from '../default/state'

import {
  ADD_NODE, DEL_NODE
} from '../actions'

let nextId = 0

const generateId = () => {
  nextId++
  return `id${nextId}`
}

const addNode = (state = defaultState, action) => {
  if (action.type === ADD_NODE) {
    const nextState = Object.assign({}, state)

    const nodeid = generateId()

    nextState.node[nodeid] = action.data

    return nextState
  } else {
    return state
  }
}

const delNode = (state = defaultState, action) => {
  if (action.type === DEL_NODE) {
    const nextState = Object.assign({}, state)

    const nodeid = action.data.id

    delete nextState.node[nodeid]

    for (let linkid in nextState.link) {
      const isSource = nextState.link[linkid].from[0] === nodeid
      const isTarget = nextState.link[linkid].to[0] === nodeid

      if (isSource || isTarget) delete nextState.link[linkid]
    }

    return nextState
  } else {
    return state
  }
}

export {
  addNode, delNode
}
