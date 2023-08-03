import { FlowViewPin } from "./pin.js"

const handledHtmlElementEvents: (keyof HTMLElementEventMap)[] = ["pointerdown", "pointerup"]
type HandledHtmlElementEventType = (typeof handledHtmlElementEvents)[number]
type HandledHtmlElementEventMap = Pick<HTMLElementEventMap, HandledHtmlElementEventType>

export class FlowViewOutput extends FlowViewPin {
	get center() {
		if (!this.node) return { x: 0, y: 0 }
		return {
			x: this.node.position.x + this.halfPinSize + this.node.borderWidth + this.offsetX,
			y: this.node.position.y + this.node.bounds.height - this.halfPinSize - this.node.borderWidth
		}
	}

	handleEvent(event: HandledHtmlElementEventMap[HandledHtmlElementEventType]) {
		super.handleEvent(event)
		if (event.type === "pointerdown") {
			if (this.view.isDraggingEdge) {
				event.stopPropagation()
			} else {
				// @ts-ignore
				event.isBubblingFromPin = true
				this.view.createSemiEdge({ source: this })
			}
		}
		if (event.type === "pointerup") {
			event.stopPropagation()
		}
	}
}
