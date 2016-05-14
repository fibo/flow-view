import CanvasItem from './CanvasItem'
import enumerableProps from './enumerableProps'

class FlowViewNode extends CanvasItem {
  constructor (canvas, props = {ins: [], outs: []}) {
    super(canvas)

    enumerableProps(this, props)
  }
}

export default FlowViewNode
