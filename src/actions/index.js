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

export const DRAG_ITEMS = 'DRAG_ITEMS'

export const dragItems = (dx, dy) => {
  return {
    type: DRAG_ITEMS,
    dx,
    dy
  }
}

export const END_DRAGGING_ITEM = 'END_DRAGGING_ITEM'

export const endDraggingItem = (id) => {
  return {
    type: END_DRAGGING_ITEM,
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

export const START_DRAGGING_ITEM = 'START_DRAGGING_ITEM'

export const startDraggingItem = (id, startingPoint) => {
  return {
    type: START_DRAGGING_ITEM,
    id,
    startingPoint
  }
}
