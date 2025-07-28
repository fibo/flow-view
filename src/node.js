import { Container, createDiv } from './common.js';
import { Input } from './input.js';
import { Output } from './output.js';
import { cssClass } from './style.js';

/**
 * @typedef {import('./types').FlowViewNodeSignature} FlowViewNodeSignature
 * @typedef {import('./types').Vector} Vector
 */

export class Node {
	container = new Container(cssClass.node);
	contentDiv = createDiv('content');

	isSelected = false;

	/** @type {Input[]} */
	inputs = []
	/** @type {Output[]} */
	outputs = []

	/**
	 * @param {{
	 *   id: string
	 *   text: string
	 *   type: string
	 *   position: Vector
	 * }} arg
	 * @param {FlowViewNodeSignature} signature
	 */
	constructor({ id, text, type, position}, { inputs, outputs }) {
		this.id = id
		this.text = text
		this.type = type

		const inputsDiv = createDiv('pins');
		const outputsDiv = createDiv('pins');
		this.container.element.append(inputsDiv, this.contentDiv, outputsDiv);

		this.position = position;

		for (let index = 0; index < inputs.length; index++) {
			const input = new Input({ node: this, index }, inputs[index]);
			this.inputs.push(input);
			inputsDiv.append(input.container.element);
		}

		for (let index = 0; index < outputs.length; index++) {
			const output = new Output({ node: this, index }, outputs[index]);
			this.outputs.push(output);
			outputsDiv.append(output.container.element);
		}

		this.container.element.addEventListener('dblclick', this);
	}

	dispose() {
		this.container.element.removeEventListener('dblclick', this);
		this.container.element.remove();
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event.type === 'dblclick') {
			event.stopPropagation();
		}
	}
}
