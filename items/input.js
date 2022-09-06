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
		event.stopPropagation();
		const connectedEdge = [...this.view.edgesMap.values()]
			.map((edge) => edge.toObject())
			.find(({ to: [nodeId, inputId] }) => nodeId === this.node.id && inputId === this.id);
		if (!connectedEdge) return;
		console.log(connectedEdge);
		const {
			id: edgeId,
			from: [nodeId, outputId],
		} = connectedEdge;
		this.view.deleteEdge(edgeId);
		this.view.createSemiEdge({ source: this.view.nodesMap.get(nodeId).outputsMap.get(outputId) });
	}

	onPointerup() {
		if (this.view.isDraggingEdge && this.view.semiEdge.hasSourcePin) {
			const { source } = this.view.semiEdge;
			this.view.newEdge({ source, target: this });
		}
	}
}
