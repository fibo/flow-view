import CanvasItem from './CanvasItem'
import enumerableProps from './enumerableProps'

class FlowViewLink extends CanvasItem {
  constructor (canvas, props) {
    super(canvas)

    enumerableProps(this, props)
  }
}

export default FlowViewLink
