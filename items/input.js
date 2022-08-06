import { FlowViewPin } from "./pin.js";

export class FlowViewInput extends FlowViewPin {
	constructor(args) {
		super(args);
		this.info.style.top = "-25px";
	}

	get center() {
		return {
			x: this.node.position.x +
				this.halfPinSize +
				this.node.borderWidth +
				this.offsetX,
			y: this.node.position.y + this.halfPinSize - this.node.borderWidth,
		};
	}

	onPointerdown(event) {
		event.stopPropagation();
	}

	onPointerup() {
		if (this.view.isDraggingEdge && this.view.semiEdge.hasSourcePin) {
			const { source } = this.view.semiEdge;
			this.view.newEdge({ source, target: this });
		}
	}

	toObject() {
		return {
			...super.toObject(),
		};
	}
}
