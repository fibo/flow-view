import { Container } from './common.js';
import { cssClass, cssNode, cssPin } from './style.js';

/**
 * @typedef {import('./link').Link} Link
 * @typedef {import('./node').Node} Node
 */

const { borderWidth } = cssNode
const { halfSize } = cssPin

export class Input {
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
		this.info.style.top = '-50px';
		if (name) this.info.textContent = name;
		this.container.element.append(this.info);
		this.node = node;
	}

	get center() {
		const nodeBounds = this.node.container.bounds;
		const offsetX = this.container.bounds.x - nodeBounds.x;
		return {
			x: this.node.position.x + halfSize + borderWidth + offsetX,
			y: this.node.position.y + halfSize - borderWidth
		}
	}
}
