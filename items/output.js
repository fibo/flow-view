import { FlowViewPin } from "./pin.js";

export class FlowViewOutput extends FlowViewPin {
	constructor(args) {
		super(args);
		this.info.style.top = "15px";
	}

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

	toObject() {
		return {
			...super.toObject(),
		};
	}
}
