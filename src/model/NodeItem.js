import FlowViewItem from './Item'
import staticProps from 'static-props'

class FlowViewNodeItem extends FlowViewItem {
  constructor (node) {
    super()

    staticProps(this)({ node })
  }
}

export default FlowViewNodeItem
