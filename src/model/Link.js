import Item from './Item'
import enumerableProps from './enumerableProps'
import validate from './validate'

class FlowViewLink extends Item {
  constructor (data) {
    validate.Link(data)

    super(id)

    enumerableProps(this, data)
  }
}

export default FlowViewLink
