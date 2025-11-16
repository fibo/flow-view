import { Container, createDiv, stop, vector } from './common.js';
import { cssClass, cssNode, cssPin } from './style.js';

/**
 * @typedef {import('./types').FlowViewNode} FlowViewNode
 * @typedef {import('./types').FlowViewNodeBodyCreator} FlowViewNodeBodyCreator
 * @typedef {import('./types').FlowViewNodeSignature} FlowViewNodeSignature
 * @typedef {import('./types').FlowViewPin} FlowViewPin
 * @typedef {import('./types').Vector} Vector
 */

const { size: pinSize, halfSize: halfPinSize } = cssPin
const { borderWidth } = cssNode

/** @type {FlowViewNodeBodyCreator} */
export function defaultNodeBodyCreator(node) {
	const div = createDiv(cssClass.nodeContent);
	div.textContent = node.text;
	return div;
}

/** @implements {FlowViewPin} */
export class Input {
	info = document.createElement('pre');
	container = new Container(cssClass.pin);
	offsetX = 0;

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
		this.container.dimensions = { width: pinSize, height: pinSize };
		this.node = node;
	}

	get center() {
		return vector.add(this.node.position, {
			x: halfPinSize + borderWidth + this.offsetX,
			y: halfPinSize - borderWidth
		})
	}
}

/** @implements {FlowViewPin} */
export class Output {
	info = document.createElement('pre');
	container = new Container(cssClass.pin);
	offsetX = 0;

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
		this.container.dimensions = { width: pinSize, height: pinSize };
		this.node = node;
	}

	get center() {
		return vector.add(this.node.position, {
			x: halfPinSize + borderWidth + this.offsetX,
			y: this.node.container.dimensions.height - halfPinSize - borderWidth
		})
	}
}

/** @implements {FlowViewNode} */
export class Node {
	container = new Container(cssClass.node);

	#isSelected = false;

	/** @type {Input[]} */
	inputs = [];
	/** @type {Output[]} */
	outputs = [];

	inputsDiv = createDiv('pins');
	outputsDiv = createDiv('pins');

	/**
	 * @param {string} id
	 * @param {string} text
	 * @param {Vector} position
	 * @param {Partial<FlowViewNodeSignature>} signature
	 */
	constructor(id, text, position, { inputs = [], outputs  = []}) {
		this.id = id;
		this.text = text;

		this.position = position;

		for (let index = 0; index < inputs.length; index++) {
			const input = new Input({ node: this, index }, inputs[index]);
			this.inputs.push(input);
			this.inputsDiv.append(input.container.element);
		}

		for (let index = 0; index < outputs.length; index++) {
			const output = new Output({ node: this, index }, outputs[index]);
			this.outputs.push(output);
			this.outputsDiv.append(output.container.element);
		}

		this.container.element.addEventListener('dblclick', this);
	}

	updatePinsOffset() {
		const bounds = this.container.element.getBoundingClientRect();
		for (const pin of [...this.inputs, ...this.outputs]) {
			if (pin.index === 0) continue;
			const pinBounds = pin.container.element.getBoundingClientRect();
			pin.offsetX = Math.floor(pinBounds.x - bounds.x);
		}
	}

	dispose() {
		this.container.element.removeEventListener('dblclick', this);
		this.container.element.remove();
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event.type === 'dblclick') stop(event);
	}

	get isSelected() { return this.#isSelected }

	/** @param {boolean} value */
	set isSelected(value) {
		this.#isSelected = value;
		this.container.highlight = value;
		if (!value) {
			for (const input of this.inputs)
				input.container.highlight = false;
			for (const output of this.outputs)
				output.container.highlight = false;
		}
	}
}
