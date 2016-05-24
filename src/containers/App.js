import { connect } from 'react-redux'
import Canvas from '../components/Canvas'

const mapStateToProps = (state, ownProps) => {
  let nodes = []

  for (var nodeid in state.node) {
    let node = state.node[nodeid]
    node.id = nodeid
    nodes.push(node)
  }

  let links = []

  for (var linkid in state.link) {
    let link = state.link[linkid]
    link.id = linkid
    links.push(link)
  }

  return { nodes, links }
}

export default connect(
  mapStateToProps
)(Canvas)
