import { FlowViewPin } from "./pin.js"
import { cssNode } from './theme.js';

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
			x: this.node.position.x + this.halfPinSize + cssNode.borderWidth + this.offsetX,
		// @ts-ignore
			y: this.node.position.y + this.halfPinSize - cssNode.borderWidth
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
		const source = view.semiEdge?.source
		if (source) {
			// Delete previous edge, only one edge per input is allowed.
			if (connectedEdge) view.deleteEdge(connectedEdge.id, {})
			// Do not connect pins of same node.
			const sourceNode = source.node
			const targetNode = this.node
			if (!sourceNode || !targetNode) return
			if (sourceNode.id === targetNode.id) return
			view.newEdge({
				// @ts-ignore
				from: [sourceNode.id, source.id],
				// @ts-ignore
				to: [targetNode.id, this.id]
			}, {})
		}
	}
}
