import { FlowViewBase } from './base.js'
import { FlowViewPin } from './pin.js'

export class FlowViewNode extends FlowViewBase {
  static cssClassName = 'fv-node'
  static minSize = FlowViewPin.size * 4;
  static style = {
    [`.${FlowViewNode.cssClassName}`]: {
      'position': 'absolute',
          "background-color": "var(--fv-node-background-color, #fefefe)",
          "box-shadow": "var(--fv-box-shadow)",
          "display": "flex",
          "flex-direction": "column",
          "justify-content": "space-between",
          "border": "1px solid transparent",
          "border": "1px solid transparent",
      "height": `${FlowViewNode.minSize}px`,
      "width": `${FlowViewNode.minSize}px`
    }
  }

  init ({ label, inputs = [], outputs = [] }) {
    this.inputs = new Map()
    this.outputs = new Map()
  }

  newInput({ id }) {
    const pin = new FlowViewPin({ id })
    this.inputs.set(pin.id, pin)
  }

  newOutput({ id }) {
    const pin = new FlowViewPin({ id })
    this.outputs.set(pin.id, pin)
  }
}
