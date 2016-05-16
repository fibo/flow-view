import Item from './Item'
import enumerableProps from './enumerableProps'
import validate from './validate'

class FlowViewNode extends Item {
  constructor (data, id) {
    validate.Node(data)

    super(id)

    enumerableProps(this, data)
  }
}

export default FlowViewNode
