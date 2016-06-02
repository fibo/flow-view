import { connect } from 'react-redux'
import {
  dragItems,
  endDraggingItems,
  selectItem,
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
    previousDraggingPoint: state.previousDraggingPoint
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectNode: (nodeid) => (e) => {
      dispatch(selectItem({
        id: nodeid,
        x: e.clientX,
        y: e.clientY
      }))
    },
    dragItems: (previousDraggingPoint) => (e) => {
      const draggingDelta = {
        x: e.clientX - previousDraggingPoint.x,
        y: e.clientY - previousDraggingPoint.y
      }

      dispatch(dragItems(previousDraggingPoint, draggingDelta))
    },
    endDraggingItems: () => {
      dispatch(endDraggingItems())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas)
