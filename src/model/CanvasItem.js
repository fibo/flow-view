import FlowViewItem from './Item'
import staticProps from 'static-props'

class FlowViewCanvasItem extends FlowViewItem {
  constructor (canvas) {
    super()

    staticProps(this)({ canvas })
  }
}

export default FlowViewCanvasItem
