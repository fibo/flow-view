import { FlowViewPin } from "./pin.js";

export class FlowViewInput extends FlowViewPin {
	constructor(args) {
		super(args);
		this.info.style.top = "-25px";
	}

	get center() {
		return {
			x: this.node.position.x + this.halfPinSize + this.node.borderWidth + this.offsetX,
			y: this.node.position.y + this.halfPinSize - this.node.borderWidth,
		};
	}

	onPointerdown(event) {
		const { view } = this;
		const connectedEdge = [...view.edgesMap.values()]
			.map((edge) => edge.toObject())
			.find(({ to: [nodeId, inputId] }) => nodeId === this.node.id && inputId === this.id);
		if (view.isDraggingEdge) {
			event.stopPropagation();
			const { semiEdge } = view;
			if (connectedEdge) {
				if (view.semiEdge.hasSourcePin) {
					const isDuplicatedEdge = semiEdge.source.node.id === connectedEdge.from[0] &&
						semiEdge.source.id === connectedEdge.from[1];
					if (isDuplicatedEdge) return;
				}
				// Delete previous edge, only one edge per input is allowed.
				view.deleteEdge(connectedEdge.id);
			}
			if (semiEdge.hasSourcePin) {
				view.newEdge({ source: semiEdge.source, target: this });
			}
		}
	}

	onPointerup() {}
}
