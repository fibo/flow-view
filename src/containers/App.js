import { connect } from 'react-redux'
import {
  dragItems,
  endDraggingItem,
  selectItem,
  startDraggingItem
} from '../actions'
import Canvas from '../components/Canvas'

const mapStateToProps = (state, ownProps) => {
  let nodes = []

  for (let id in state.node) {
    const selected = (state.selectedItems.indexOf(id) > -1)
    nodes.push(
      Object.assign(
        {
          ins: [],
          outs: [],
          id,
          selected,
          dragged: (selected && state.isDraggingItems)
        },
        state.node[id]
      )
    )
  }

  let links = []

  for (let id in state.link) {
    const link = Object.assign(
      {
        id,
        selected: (state.selectedItems.indexOf(id) > -1)
      },
      state.link[id]
    )

    links.push(link)
  }

  return {
    height: (ownProps.height || state.height),
    width: (ownProps.width || state.width),
    nodes,
    links,
    selectedItems: state.selectedItems,
    startDraggingPoint: state.startDraggingPoint
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectNode: (nodeid) => () => {
      dispatch(selectItem(nodeid))
    },
    dragItems: (dx, dy) => {
      dispatch(dragItems(dx, dy))
    },
    endDraggingItem: () => {
      dispatch(endDraggingItem())
    },
    startDraggingItem: (id) => (e) => {
      const startingPoint = {
        x: e.clientX,
        y: e.clientY
      }

      dispatch(startDraggingItem(id, startingPoint))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas)
