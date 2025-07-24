import { Container } from './common.js';
import { cssClass, cssNode, cssPin } from './theme.js';
import { FlowViewOutput } from './output.js';

/**
 * @typedef {import('./edge').FlowViewEdge} FlowViewEdge
 * @typedef {import('./node').FlowViewNode} FlowViewNode
 */

const { borderWidth } = cssNode
const { halfSize } = cssPin

const eventTypes = [
	'pointerenter', 'pointerleave', 'pointerup', 'pointerdown'
];

export class FlowViewInput {
	info = document.createElement('pre');
	container = new Container(cssClass.pin);
	/** @type {FlowViewEdge | undefined} */
	edge

	/** @param {{ id: string, node: FlowViewNode }} arg */
	constructor({ id, node }) {
		this.id = id
		this.info.classList.add('info');
		this.info.style.top = '-50px';
		this.container.element.appendChild(this.info);
		this.node = node;
		eventTypes.forEach((eventType) => this.container.element.addEventListener(eventType, this));
	}

	get center() {
		const nodeBounds = this.node.container.bounds;
		const offsetX = this.container.bounds.x - nodeBounds.x;
		return {
			x: this.node.position.x + halfSize + borderWidth + offsetX,
			y: this.node.position.y + halfSize - borderWidth
		}
	}

	dispose() {
		eventTypes.forEach((eventType) => this.container.element.removeEventListener(eventType, this));
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event.type === 'pointerenter') {
			this.container.highlight = true;
		}
		if (event.type === 'pointerleave') {
			this.container.highlight = false;
		}
		if (event.type === 'pointerdown') {
			event.stopPropagation()
		}
		if (event.type === 'pointerup') {
			const source = this.node.view.pendingPin
			if (source instanceof FlowViewOutput) {
				// Delete previous edge, only one edge per input is allowed.
				if (this.edge) this.edge.delete()
				// Do not connect pins of same node.
				const sourceNode = source.node
				const targetNode = this.node
				if (!sourceNode || !targetNode) return
				if (sourceNode.id === targetNode.id) return
				this.node.view.newEdge({
					from: [sourceNode.id, source.id],
					to: [targetNode.id, this.id]
				})
			}
		}
	}

	toObject() {
		return {
			id: this.id
		}
	}
}
