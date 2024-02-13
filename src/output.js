import { FlowViewPin, halfPinSize } from "./pin.js"

export class FlowViewOutput extends FlowViewPin {
  get center() {
    return {
      x: this.node.position.x + halfPinSize + this.node.borderWidth + this.offsetX,
      y: this.node.position.y + this.node.bounds.height - halfPinSize - this.node.borderWidth
    }
  }

  /** @param {any} event */
  handleEvent(event) {
    super.handleEvent(event)
    if (event.type === "pointerdown") {
      if (this.view.isDraggingEdge) {
        event.stopPropagation()
      } else {
        event.isBubblingFromPin = true
        this.view.createSemiEdge({ source: this })
      }
    }
    if (event.type === "pointerup") {
      event.stopPropagation()
    }
  }
}
