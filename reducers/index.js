import initialState from '../util/initialState'
import {
  ADD_NODE,
  ADD_LINK,
  DEL_NODE,
  DRAG_ITEMS,
  DRAG_LINK,
  END_DRAGGING_ITEMS,
  END_DRAGGING_LINK,
  HIDE_NODE_SELECTOR,
  SELECT_ITEM,
  SET_NODE_SELECTOR_TEXT,
  SHOW_NODE_SELECTOR
} from '../actions'

const flowViewApp = (state = initialState, action) => {
  let nextId = 0

  const generateId = () => {
    nextId++

    const newId = `id${nextId}`

    const currentIds = Object.keys(state.node).concat(Object.keys(state.link))

    const foundId = (currentIds.filter(
      (id) => { return id === newId }
    ).length === 1)

    if (foundId) return generateId()
    else return newId
  }

  switch (action.type) {
    case ADD_LINK:
      let link = Object.assign({}, state.link)

      link[generateId()] = action.link

      return Object.assign({}, state, {
        link,
        selectedItems: [],
        previousDraggingPoint: action.previousDraggingPoint
      })

    case ADD_NODE:
      let node = Object.assign({}, state.node)

      node[generateId()] = action.node

      return Object.assign({},
        state,
        {
          node,
          nodeSelector: null
        }
      )

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

    case DRAG_ITEMS:
      const dx = action.draggingDelta.x
      const dy = action.draggingDelta.y

      const draggedNodes = Object.assign({}, state.node)
      let previousDraggingPoint = {
        x: state.previousDraggingPoint.x + dx,
        y: state.previousDraggingPoint.y + dy
      }

      for (let nodeid in draggedNodes) {
        const isDraggedNode = (state.selectedItems.indexOf(nodeid) === -1)

        if (isDraggedNode) {
          continue
        } else {
          draggedNodes[nodeid].x += dx
          draggedNodes[nodeid].y += dy
        }
      }

      return Object.assign({}, state, {
        node: draggedNodes,
        previousDraggingPoint
      })

    case DRAG_LINK:
      return Object.assign({}, state, {
        previousDraggingPoint: {
          x: state.previousDraggingPoint.x + action.draggingDelta.x,
          y: state.previousDraggingPoint.y + action.draggingDelta.y
        }
      })

    case END_DRAGGING_ITEMS:
      return Object.assign({}, state, {
        isDraggingItems: false,
        previousDraggingPoint: null
      })

    case END_DRAGGING_LINK:
      let newLink = Object.assign({}, state.link)

      if (action.link) {
        const newFrom = action.link.from
        const newTo = action.link.to

        if (newFrom) newLink[action.id].from = newFrom
        if (newTo) newLink[action.id].to = newTo
      } else {
        // Remove dragged link.
        delete newLink[action.id]
      }

      return Object.assign({}, state, {
        previousDraggingPoint: null,
        draggedLinkId: null,
        link: newLink
      })

    case HIDE_NODE_SELECTOR:
      return Object.assign({}, state, {
        nodeSelector: null
      })

    case SELECT_ITEM:
      let selectedItems = []
      let itemId = action.id

      const indexOfSelectedItem = selectedItems.indexOf(itemId)
      const itemIsNotAlreadySelected = (indexOfSelectedItem === -1)

      if (itemIsNotAlreadySelected) {
        selectedItems.push(itemId)
      } else {
        selectedItems.splice(indexOfSelectedItem, 1)
      }

      return Object.assign({}, state, {
        isDraggingItems: true,
        previousDraggingPoint: {
          x: action.x,
          y: action.y
        },
        selectedItems,
        nodeSelector: null
      })

    case SET_NODE_SELECTOR_TEXT:
      return Object.assign({}, state, {
        nodeSelector: {
          text: action.text
        }
      })

    case SHOW_NODE_SELECTOR:
      return Object.assign({}, state, {
        nodeSelector: {
          x: action.x,
          y: action.y
        }
      })

    default:
      return state
  }
}

export default flowViewApp
