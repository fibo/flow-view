import { FlowViewPin } from "./pin.js"
import { cssNode } from './theme.js';

export class FlowViewOutput extends FlowViewPin {
	get center() {
		return {
		// @ts-ignore
			x: this.node.position.x + this.halfPinSize + cssNode.borderWidth + this.offsetX,
		// @ts-ignore
			y: this.node.position.y + this.node.bounds.height - this.halfPinSize - cssNode.borderWidth
		}
	}

		// @ts-ignore
	onPointerdown(event) {
		if (this.view.semiEdge) {
			event.stopPropagation()
		} else {
			event.isBubblingFromPin = true
			this.view.createSemiEdge({ source: this })
		}
	}

		// @ts-ignore
	onPointerup(event) {
		event.stopPropagation()
	}
}
