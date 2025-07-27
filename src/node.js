import { Container, createDiv } from './common.js';
import { cssClass } from './theme.js';
import { FlowViewInput } from './input.js';
import { FlowViewOutput } from './output.js';

/**
 * @typedef {import('./flow-view').FlowView} FlowView
 * @typedef {import('./types').FlowViewNodeSignature} FlowViewNodeSignature
 * @typedef {import('./types').Vector} Vector
 */

const eventTypes = ['dblclick'];

export class FlowViewNode {
	/** @type {Vector} */
    #position = { x: 0, y: 0 };

	container = new Container(cssClass.node);

	isSelected = false;

	contentDiv = createDiv('content');

	/** @type {FlowViewInput[]} */
	inputs = []
	/** @type {FlowViewOutput[]} */
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

		this.view = view;
		this.position = position;

		for (let index = 0; index < inputs.length; index++) {
			const input = new FlowViewInput({ node: this, index }, inputs[index]);
			this.inputs.push(input);
			inputsDiv.append(input.container.element);
		}

		for (let index = 0; index < outputs.length; index++) {
			const output = new FlowViewOutput({ node: this, index }, outputs[index]);
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

	get position() {
		return this.#position;
	}

	set position({ x, y }) {
		this.#position = { x, y };
		this.container.element.style.top = `${y - this.view.origin.y}px`
		this.container.element.style.left = `${x - this.view.origin.x}px`
	}
}
