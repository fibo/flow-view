import { FlowViewPin } from "./pin.js"
import { cssNode, cssPin } from './theme.js';

const { borderWidth } = cssNode;
const { halfSize } = cssPin;

export class FlowViewOutput extends FlowViewPin {
	get center() {
		// @ts-ignore
		const offsetX = this.bounds.x - this.node.bounds.x
		return {
		// @ts-ignore
			x: this.node.position.x + halfSize + borderWidth + offsetX,
		// @ts-ignore
			y: this.node.position.y + this.node.bounds.height - this.halfPinSize - borderWidth
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
