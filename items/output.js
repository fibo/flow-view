import { FlowViewPin } from "./pin.js";

export class FlowViewOutput extends FlowViewPin {
	get center() {
		return {
			x: this.node.position.x + this.halfPinSize + this.node.borderWidth + this.offsetX,
			y: this.node.position.y + this.node.bounds.height - this.halfPinSize - this.node.borderWidth,
		};
	}

	onPointerdown(event) {
		event.isBubblingFromPin = true;
		this.view.createSemiEdge({ source: this });
	}

	onPointerup(event) {
		event.stopPropagation();
	}
}
