export const ADD_LINK = 'ADD_LINK'
export const ADD_NODE = 'ADD_NODE'
export const DEL_LINK = 'DEL_LINK'
export const DEL_NODE = 'DEL_NODE'

export const addNode = (node) => {
  return {
    type: ADD_NODE,
    node
  }
}

export const addLink = (link) => {
  return {
    type: ADD_LINK,
    link
  }
}

export const delNode = (nodeid) => {
  return {
    type: DEL_NODE,
    nodeid
  }
}

export const delLink = (linkid) => {
  return {
    type: DEL_LINK,
    linkid
  }
}
