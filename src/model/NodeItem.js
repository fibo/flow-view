import staticProps from 'static-props'

class FlowViewNodeItem {
  constructor (node) {
    staticProps(this)({ node })
  }
}

export default FlowViewNodeItem
