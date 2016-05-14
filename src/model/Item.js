import staticProps from 'static-props'

let nextid = 0

class FlowViewItem {
  constructor () {
    staticProps(this)({ id: nextid++ })
  }
}

export default FlowViewItem
