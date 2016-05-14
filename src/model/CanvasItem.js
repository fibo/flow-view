import staticProps from 'static-props'

class FlowViewCanvasItem {
  constructor (canvas) {
    staticProps(this)({ canvas })
  }
}

export default FlowViewCanvasItem
