export const ADD_NODE = 'ADD_NODE'

export const addNode = (node) => {
  return {
    type: ADD_NODE,
    node
  }
}

export const ADD_LINK = 'ADD_LINK'

export const addLink = (link) => {
  return {
    type: ADD_LINK,
    link
  }
}

export const DEL_NODE = 'DEL_NODE'

export const delNode = (id) => {
  return {
    type: DEL_NODE,
    id
  }
}

export const DEL_LINK = 'DEL_LINK'

export const delLink = (id) => {
  return {
    type: DEL_LINK,
    id
  }
}

export const SELECT_ITEM = 'SELECT_ITEM'

export const selectItem = (id) => {
  return {
    type: SELECT_ITEM,
    id
  }
}
