import { FlowViewPin } from "./pin.js"

/**
 * @typedef {import('./types').FlowViewInputConstructorArg} FlowViewInputConstructorArg
 */

export class FlowViewInput extends FlowViewPin {
	/** @param {FlowViewInputConstructorArg} arg */
	constructor(arg) {
		super(arg)
		// @ts-ignore
		this.info.style.top = "-50px"
	}

	get center() {
		return {
		// @ts-ignore
			x: this.node.position.x + this.halfPinSize + this.node.borderWidth + this.offsetX,
		// @ts-ignore
			y: this.node.position.y + this.halfPinSize - this.node.borderWidth
		}
	}

	get connectedEdge() {
		return [...this.view.edgesMap.values()]
			.map((edge) => edge.toObject())
			// @ts-ignore
			.find(({ to: [nodeId, inputId] }) => nodeId === this.node.id && inputId === this.id)
	}

   // @ts-ignore
	onPointerdown(event) {
		event.stopPropagation()
	}

	onPointerup() {
		const { connectedEdge, view } = this
		if (view.isDraggingEdge) {
			const { semiEdge } = view
			if (semiEdge.hasSourcePin) {
				const { source } = semiEdge
				// Delete previous edge, only one edge per input is allowed.
				if (connectedEdge) view.deleteEdge(connectedEdge.id, {})
				// Do not connect pins of same node.
   // @ts-ignore
				if (source.node.id === this.node.id) return
				// @ts-ignore
				view.newEdge({ source, target: this }, {})
			}
		}
	}
}
