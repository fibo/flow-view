import { Container } from './common.js';
import { cssClass, cssNode, cssPin } from './theme.js';

/**
 * @typedef {import('./types').InputConstructorArg} ConstructorArg
 */

const { borderWidth } = cssNode
const { halfSize } = cssPin

const eventTypes = [
	'pointerenter', 'pointerleave', 'pointerup', 'pointerdown'
];

export class FlowViewInput {
	info = document.createElement('pre');
	container = new Container(cssClass.pin);

	/** @param {ConstructorArg} arg */
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

	get connectedEdge() {
		return this.node.view.edges
			.map((edge) => edge.toObject())
			// @ts-ignore
			.find(({ to: [nodeId, inputId] }) => nodeId === this.node.id && inputId === this.id)
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event.type === 'pointerenter') {
			this.container.highlight = true
		}
		if (event.type === 'pointerleave') {
			this.container.highlight = false
		}
		if (event.type === 'pointerdown') {
			event.stopPropagation()
		}
		if (event.type === 'pointerup') {
			const { connectedEdge } = this
			const source = this.node.view.semiEdge?.source
			if (source) {
				// Delete previous edge, only one edge per input is allowed.
				if (connectedEdge) this.node.view.deleteEdge(connectedEdge.id, {})
				// Do not connect pins of same node.
				const sourceNode = source.node
				const targetNode = this.node
				if (!sourceNode || !targetNode) return
				if (sourceNode.id === targetNode.id) return
				this.node.view.newEdge({
					// @ts-ignore
					from: [sourceNode.id, source.id],
					// @ts-ignore
					to: [targetNode.id, this.id]
				}, {})
			}
		}
	}

	toObject() {
		return {
			id: this.id
		}
	}
}
