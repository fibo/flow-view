import Item from './Item'
import enumerableProps from './enumerableProps'
import validate from './validate'

class FlowViewNode extends Item {
  constructor (data, id) {
    validate.Node(data)

    super(id)

    enumerableProps(this, data)
  }

  numIns () {
    return this.data.ins.length
  }

  numOuts () {
    return this.data.outs.length
  }
}

export default FlowViewNode
