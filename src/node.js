import { Container, createDiv } from './common.js';
import { cssClass } from './theme.js';
import { Input } from './input.js';
import { Output } from './output.js';

/**
 * @typedef {import('./flow-view').FlowView} FlowView
 * @typedef {import('./types').FlowViewNodeSignature} FlowViewNodeSignature
 * @typedef {import('./types').Vector} Vector
 */

const eventTypes = ['dblclick'];

export class Node {
	container = new Container(cssClass.node);

	isSelected = false;

	contentDiv = createDiv('content');

	/** @type {Input[]} */
	inputs = []
	/** @type {Output[]} */
	outputs = []

	/**
	 * @param {{
	 *   id: string
	 *   text: string
	 *   type: string
	 *   view: FlowView
	 *   position: Vector
	 * }} arg
	 * @param {FlowViewNodeSignature} signature
	 */
	constructor({ id, text, type, view, position}, { inputs, outputs }) {
		this.id = id
		this.text = text
		this.type = type

		const inputsDiv = createDiv('pins');
		const outputsDiv = createDiv('pins');
		this.container.element.append(inputsDiv, this.contentDiv, outputsDiv);

		this.position = position;
		this.view = view;

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

		eventTypes.forEach((eventType) => this.container.element.addEventListener(eventType, this));
	}

	dispose() {
		eventTypes.forEach((eventType) => this.container.element.removeEventListener(eventType, this));
		for (const input of this.inputs) input.dispose()
		for (const output of this.outputs) output.dispose()
		this.container.element.remove();
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event.type === 'dblclick') {
			event.stopPropagation();
		}
	}
}
