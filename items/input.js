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

	get connectedEdge() {
		return [...this.view.edgesMap.values()]
			.map((edge) => edge.toObject())
			.find(({ to: [nodeId, inputId] }) => nodeId === this.node.id && inputId === this.id);
	}

	onPointerdown(event) {
		event.stopPropagation();
	}

	onPointerup() {
		const { connectedEdge, view } = this;
		if (view.isDraggingEdge) {
			const { semiEdge } = view;
			if (semiEdge.hasSourcePin) {
				const { source } = semiEdge;
				if (connectedEdge) {
					// Avoid duplicated edges.
					if (source.node.id === connectedEdge.from[0] && source.id === connectedEdge.from[1]) return;
					// Delete previous edge, only one edge per input is allowed.
					view.deleteEdge(connectedEdge.id);
				}
				// Do not connect pins of same node.
				if (source.node.id === this.node.id) return;
				view.newEdge({ source, target: this });
			}
		}
	}
}
