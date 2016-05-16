import enumerableProps from './enumerableProps'
import defaultState from '../default/state'

class FlowViewCanvas {
  constructor (data = defaultState) {
    enumerableProps(this, data)
  }
}

export default FlowViewCanvas
