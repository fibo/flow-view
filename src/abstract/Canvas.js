import enumerableProps from './enumerableProps'

class FlowViewCanvas {
  constructor (node = {}, link = {}) {

    enumerableProps(this, {
      node, link
    })
  }
}

export default FlowViewCanvas
