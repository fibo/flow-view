import NodeItem from './NodeItem'
import enumerableProps from './enumerableProps'

class FlowViewPin extends NodeItem {
  constructor (node, props) {
    super(node)

    enumerableProps(this, props)
  }
}

export default FlowViewPin
