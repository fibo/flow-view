import from './CanvasItem'
import enumerableProps from './enumerableProps'

class FlowViewNode extends CanvasItem {
  constructor (canvas, props) {
    super(canvas)

    enumerableProps(this, props)
  }
}

export default FlowViewNode
