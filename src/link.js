import { Container, ctrlOrMeta, createSvg, stop } from './common.js';
import { Input, Output } from './node.js';
import { cssClass } from './style.js'

/**
 * @typedef {import('./flow-view.d.ts').FlowViewPin} FlowViewPin
 * @typedef {import('./flow-view.d.ts').Dimensions} Dimensions
 * @typedef {import('./flow-view.d.ts').Vector} Vector
 *
 * @typedef {{
 *   delete: () => void,
 *   select: (isMulti: boolean) => void
 * }} LinkAction
 */

export class Connection {
	container = createSvg('svg');
	line = createSvg('line');

	constructor() {
		this.container.append(this.line);
	}

	/** @param {Dimensions} dimensions */
	set dimensions({ width, height }) {
		this.container.setAttribute('width', `${width}`);
		this.container.setAttribute('height', `${height}`);
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

const eventTypes = ['dblclick', 'pointerdown', 'pointerenter', 'pointerleave'];

export class Link {
	container = new Container(cssClass.link);
	connection = new Connection();

	/** @type {Output} */
	source;
	/** @type {Input} */
	target;

	/** @type {LinkAction} */
	#action;

	#isSelected = false;

	/**
	 * @param {Output} source
	 * @param {Input} target
	 * @param {LinkAction} action
	 */
	constructor(source, target, action) {
		this.container.element.append(this.connection.container)
		this.source = source;
		this.target = target;
		this.#action = action;

		eventTypes.forEach((eventType) => this.connection.line.addEventListener(eventType, this));
	}

	dispose() {
		eventTypes.forEach((eventType) => this.connection.line.removeEventListener(eventType, this));
		this.container.element.remove()
	}

	/** @param {MouseEvent | PointerEvent} event */
	handleEvent(event) {
		if (event.type === 'dblclick') {
			stop(event);
			this.#action.delete();
		}
		if (event.type === 'pointerdown') {
			stop(event);
			this.#action.select(ctrlOrMeta(event));
		}
		if (event.type === 'pointerenter') {
			if (this.#isSelected) return;
			this.container.highlight = true;
		}
		if (event.type === 'pointerleave') {
			if (this.#isSelected) return;
			this.container.highlight = false;
		}
	}

	get start() { return this.source.center }
	get end() { return this.target.center }

	get id() { return [this.target.node.id, this.target.index].join() }

	/** @param {boolean} value */
	set isSelected(value) {
		this.#isSelected = value;
		this.container.highlight = value;
		this.source.container.highlight = value;
		this.target.container.highlight = value;
	}
}

export class SemiLink {
	container = new Container(cssClass.link);
	connection = new Connection();
	/** @type {Vector} */
	start;
	/** @type {Vector} */
	end;
	/**
	 * @param {FlowViewPin} pin
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

