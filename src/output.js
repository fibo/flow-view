import { Container } from './common.js';
import { cssClass, cssNode, cssPin } from './theme.js';

/**
 * @typedef {import('./node').Node} Node
 */

const { borderWidth } = cssNode;
const { halfSize } = cssPin;

const eventTypes = [
	'pointerenter', 'pointerleave', 'pointerup', 'pointerdown'
];

export class Output {
	info = document.createElement('pre');
	container = new Container(cssClass.pin);

	/**
	 * @param {{
	 *   node: Node
	 *   index: number
	 * }} arg
	 * @param {{ name?: string }} info
	 */
	constructor({ node, index }, { name }) {
		this.index = index
		this.info.classList.add('info');
		if (name) this.info.textContent = name;
		this.container.element.append(this.info);
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
			this.node.view.createSemiLink(this);
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
