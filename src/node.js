import { Container, createHtml, div, stop, vector } from './common.js';
import { cssClass, cssNode, cssPin } from './style.js';

/**
 * @typedef {import('./flow-view.d.ts').FlowViewNode} FlowViewNode
 * @typedef {import('./flow-view.d.ts').FlowViewNodeBodyCreator} FlowViewNodeBodyCreator
 * @typedef {import('./flow-view.d.ts').FlowViewNodeSignature} FlowViewNodeSignature
 * @typedef {import('./flow-view.d.ts').FlowViewPinMetadata} FlowViewPinMetadata
 *
 * @typedef {import('./internals.d.ts').Pin} Pin
 * @typedef {import('./internals.d.ts').Vector} Vector
 *
 * @typedef {{
 *   select: () => void
 * }} NodeAction
 */

const { size: pinSize, halfSize: halfPinSize } = cssPin
const { borderWidth } = cssNode

const { xy, add } = vector;

/** @type {FlowViewNodeBodyCreator} */
export const defaultNodeBodyCreator = (node) =>
	div(cssClass.nodeContent, [node.text]);

/** @implements {Pin} */
export class Input {
	info = createHtml('pre');
	container = new Container(cssClass.pin);
	offsetX = 0;

	/**
	 * @param {Node} node
	 * @param {number} index
	 * @param {{ name?: string }} FlowViewPinMetadata
	 */
	constructor(node, index, { name }) {
		this.index = index
		this.info.classList.add('info');
		this.info.style.top = '-50px';
		if (name) this.info.textContent = name;
		this.container.element.append(this.info);
		this.container.dimensions = { width: pinSize, height: pinSize };
		this.node = node;
	}

	get center() {
		return add(this.node.position, xy(halfPinSize + borderWidth + this.offsetX, halfPinSize - borderWidth))
	}
}

/** @implements {Pin} */
export class Output {
	info = createHtml('pre');
	container = new Container(cssClass.pin);
	offsetX = 0;

	/**
	 * @param {Node} node
	 * @param {number} index
	 * @param {{ name?: string }} FlowViewPinMetadata
	 */
	constructor(node, index, { name }) {
		this.index = index
		this.info.classList.add('info');
		if (name) this.info.textContent = name;
		this.container.element.append(this.info);
		this.container.dimensions = { width: pinSize, height: pinSize };
		this.node = node;
	}

	get center() {
		return add(this.node.position, xy(halfPinSize + borderWidth + this.offsetX, this.node.container.dimensions.height - halfPinSize - borderWidth))
	}
}

const eventTypes = ['dblclick', 'pointerdown'];

/** @implements {FlowViewNode} */
export class Node {
	container = new Container(cssClass.node);
	inputsDiv = div('pins');
	outputsDiv = div('pins');

	#isSelected = false;
	/** @type {NodeAction} */
	#action;
	/** @type {Input[]} */
	inputs = [];
	/** @type {Output[]} */
	outputs = [];

	/**
	 * @param {string} id
	 * @param {string} text
	 * @param {Vector} position
	 * @param {Partial<FlowViewNodeSignature>} signature
	 * @param {NodeAction} action
	 */
	constructor(id, text, position, { inputs = [], outputs  = []}, action) {
		this.id = id;
		this.text = text;
		this.position = position;
		this.#action = action;

		for (let index = 0; index < inputs.length; index++) {
			const input = new Input(this, index, inputs[index]);
			this.inputs.push(input);
			this.inputsDiv.append(input.container.element);
		}

		for (let index = 0; index < outputs.length; index++) {
			const output = new Output(this, index, outputs[index]);
			this.outputs.push(output);
			this.outputsDiv.append(output.container.element);
		}

		eventTypes.forEach((eventType) => this.container.element.addEventListener(eventType, this));
	}

	dispose() {
		eventTypes.forEach((eventType) => this.container.element.removeEventListener(eventType, this));
		this.container.element.remove();
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event.type === 'dblclick') stop(event);
		if (event.type === 'pointerdown') this.#action.select();
	}

	toJSON() { return { text: this.text, ...this.position } }

	updatePinsOffset() {
		const bounds = this.container.element.getBoundingClientRect();
		for (const pin of [...this.inputs, ...this.outputs]) {
			if (pin.index === 0) continue;
			const pinBounds = pin.container.element.getBoundingClientRect();
			pin.offsetX = Math.floor(pinBounds.x - bounds.x);
		}
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
