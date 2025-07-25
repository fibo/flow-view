import { Container } from './common.js';
import { cssClass, cssNode, cssPin } from './theme.js';

/**
 * @typedef {import('./edge').FlowViewEdge} FlowViewEdge
 * @typedef {import('./node').FlowViewNode} FlowViewNode
 */

const { borderWidth } = cssNode;
const { halfSize } = cssPin;

const eventTypes = [
	'pointerenter', 'pointerleave', 'pointerup', 'pointerdown'
];

export class FlowViewOutput {
	info = document.createElement('pre');
	container = new Container(cssClass.pin);

	/** @param {{ id: string, node: FlowViewNode }} arg */
	constructor({ id, node }) {
		this.id = id
		this.info.classList.add('info');
		this.container.element.appendChild(this.info);
		this.node = node;
		eventTypes.forEach((eventType) => this.container.element.addEventListener(eventType, this));
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event.type === 'pointerenter') {
			this.container.highlight = true;
		}
		if (event.type === 'pointerleave') {
			this.container.highlight = false;
		}
		if (event.type === 'pointerup') {
			event.stopPropagation();
		}
		if (event.type === 'pointerdown') {
			this.node.view.createSemiEdge(this);
		}
	}

	dispose() {
		eventTypes.forEach((eventType) => this.container.element.removeEventListener(eventType, this));
	}

	get center() {
		const nodeBounds = this.node.container.bounds;
		const offsetX = this.container.bounds.x - nodeBounds.x;
		return {
			x: this.node.position.x + halfSize + borderWidth + offsetX,
			y: this.node.position.y + nodeBounds.height - halfSize - borderWidth
		}
	}
}
