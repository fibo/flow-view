import { connect } from 'react-redux'
import Canvas from '../components/Canvas'

const mapStateToProps = (state, ownProps) => {
  let nodes = []

  for (let id in state.node) {
    const node = Object.assign(
      {
        ins: [],
        outs: [],
        id
      },
      state.node[id]
    )

    nodes.push(node)
  }

  let links = []

  for (let id in state.link) {
    let link = state.link[id]
    link.id = id
    links.push(link)
  }

  return {
    height: (ownProps.height || state.height),
    width: (ownProps.width || state.width),
    nodes,
    links
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
/*
    onChangePostbackSelect: (e) => {
      const postbackId = e.target.value

      dispatch(changeSelectedPostback(postbackId))
    },
    onChangePostbackRadioButton: (selectedPostback) => {
      return function (e) {
        const isActive = e.currentTarget.value === 'yes'

        if (selectedPostback.isActive !== isActive) {
          dispatch(toggleSelectedPostback(selectedPostback))
        }
      }
    }
*/
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas)
