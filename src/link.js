import { createSvg, Container } from './common.js';
import { Input, Output } from './node.js';
import { cssClass } from './style.js'

/**
 * @typedef {import('./types').Vector} Vector
 */

export class Connection {
	container = createSvg('svg');
	line = createSvg('line');

	constructor() {
		this.container.append(this.line);
	}

	/** @param {number} arg */
	set width(arg) {
		this.container.setAttribute('width', `${arg}`);
	}
	/** @param {number} arg */
	set height(arg) {
		this.container.setAttribute('height', `${arg}`);
	}

	/** @param {Vector} arg */
	set start({ x, y }) {
		this.line.setAttribute('x1', `${x}`)
		this.line.setAttribute('y1', `${y}`)
	}
	/** @param {Vector} arg */
	set end({ x, y }) {
		this.line.setAttribute('x2', `${x}`)
		this.line.setAttribute('y2', `${y}`)
	}
}

export class Link {
	container = new Container(cssClass.link);
	connection = new Connection();

	isSelected = false;

	/**
	 * @param {Output} source
	 * @param {Input} target
	 * @param {{ delete: () => void, select: () => void }} action
	 */
	constructor(source, target, action) {
		this.container.element.append(this.connection.container)
		this.source = source;
		this.target = target;
		this.delete = action.delete;
		this.select = action.select;

		this.connection.line.addEventListener('dblclick', this)
		this.connection.line.addEventListener('pointerdown', this)
		this.connection.line.addEventListener('pointerenter', this)
		this.connection.line.addEventListener('pointerleave', this)
	}

	dispose() {
		this.connection.line.removeEventListener('dblclick', this)
		this.connection.line.removeEventListener('pointerdown', this)
		this.connection.line.removeEventListener('pointerenter', this)
		this.connection.line.removeEventListener('pointerleave', this)
		this.container.element.remove()
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event.type === 'dblclick') {
			event.stopPropagation();
			this.delete();
		}
		if (event instanceof PointerEvent && event.type === 'pointerdown') {
			event.stopPropagation()
			this.select();
		}
		if (event.type === 'pointerenter') {
			if (this.isSelected) return
			this.container.highlight = true
			this.source.container.highlight = true
			this.target.container.highlight = true
		}
		if (event.type === 'pointerleave') {
			const { source, target } = this
			if (!source || !target) return
			if (!this.isSelected) {
				this.container.highlight = false
				if (!source.node.isSelected) {
					source.container.highlight = false
				}
				if (!target.node.isSelected) {
					target.container.highlight = false
				}
			}
		}
	}

	get start() { return this.source.center }
	get end() { return this.target.center }
}

export class SemiLink {
	container = new Container(cssClass.link);
	connection = new Connection();
	/**
	 * @param {Input | Output} pin
	 * @param {Vector} position
	 */
	constructor(pin, position) {
		this.start = position;
		this.end = position;
		this.pin = pin;
		if (pin instanceof Input)
			this.end = pin.center;
		if (pin instanceof Output)
			this.start = pin.center;
		this.container.element.append(this.connection.container);
	}
	dispose() {
		this.container.element.remove();
	}
}

