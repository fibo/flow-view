import { connect } from 'react-redux'
import {
  selectItem
} from '../actions'
import Canvas from '../components/Canvas'

const mapStateToProps = (state, ownProps) => {
  let nodes = []

  for (let id in state.node) {
    nodes.push(
      Object.assign(
        {
          ins: [],
          outs: [],
          id,
          selected: (state.selectedItems.indexOf(id) > -1)
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
    selectedItems: state.selectedItems
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickNode: (nodeid) => () => {
      dispatch(selectItem(nodeid))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas)
