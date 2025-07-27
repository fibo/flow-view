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

	/**
	 * @param {{
	 *   node: FlowViewNode
	 *   index: number
	 * }} arg
	 * @param {{ name?: string }} info
	 */
	constructor({ node, index }, { name }) {
		this.index = index
		this.info.classList.add('info');
		this.info.style.top = '-50px';
		if (name) this.info.textContent = name;
		this.container.element.append(this.info);
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
				this.node.view.newLink(
					[sourceNode.id, source.index],
					[targetNode.id, this.index]
				)
			}
		}
	}
}
