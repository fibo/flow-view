export const ADD_LINK = 'ADD_LINK'
export const ADD_NODE = 'ADD_NODE'
export const DEL_LINK = 'DEL_LINK'
export const DEL_NODE = 'DEL_NODE'

export const addNode = (data) => {
  return {
    type: ADD_NODE,
    data
  }
}

export const addLink = (data) => {
  return {
    type: ADD_LINK,
    data
  }
}

export const delNode = (id) => {
  return {
    type: DEL_NODE,
    data: { id }
  }
}

export const delLink = (id) => {
  return {
    type: DEL_LINK,
    data: { id }
  }
}
