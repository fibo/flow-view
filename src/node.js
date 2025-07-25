import { Container, createDiv } from './common.js';
import { cssClass } from './theme.js';
import { FlowViewInput } from './input.js';
import { FlowViewOutput } from './output.js';

/**
 * @typedef {import('./types').NodeConstructorArg} ConstructorArg
 * @typedef {import('./types').FlowViewNodeObj} FlowViewNodeObj
 * @typedef {import('./types').FlowViewOutputObj} FlowViewOutputObj
 * @typedef {import('./types').FlowViewInputObj} FlowViewInputObj
 * @typedef {import('./types').Vector} Vector
 */

const eventTypes = ['dblclick'];

export class FlowViewNode {
	/** @type {Vector} */
    #position = { x: 0, y: 0 };

	container = new Container(cssClass.node);

	isSelected = false;
	inputsMap = new Map()
	outputsMap = new Map()
	inputsDiv = createDiv('pins');
	outputsDiv = createDiv('pins');
	contentDiv = createDiv('content');

	/**
	 * @param {ConstructorArg} arg
	 */
	constructor({ id, text, type, view, x, y }) {
		this.id = id
		this.text = text
		this.type = type
		this.container.element.append(this.inputsDiv, this.contentDiv, this.outputsDiv);
		this.view = view;
		this.position = { x, y };
		eventTypes.forEach((eventType) => this.container.element.addEventListener(eventType, this));
	}

	dispose() {
		eventTypes.forEach((eventType) => this.container.element.removeEventListener(eventType, this));
		for (const input of this.inputs) input.dispose()
		for (const output of this.outputs) output.dispose()
		this.container.element.remove();
	}

	/** @param {FlowViewNodeObj} node */
	initContent(node) {
		this.contentDiv.textContent = node.text
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event.type === 'dblclick') {
			event.stopPropagation();
		}
	}

	get inputs() {
		return [...this.inputsMap.values()]
	}

	get outputs() {
		return [...this.outputsMap.values()]
	}

	get position() {
		return this.#position;
	}

	set position({ x, y }) {
		this.#position = { x, y };
		this.container.element.style.top = `${y - this.view.origin.y}px`
		this.container.element.style.left = `${x - this.view.origin.x}px`
	}

	/** @param {string} id */
	deleteInput(id) {
		const input = this.inputsMap.get(id)
		input.remove()
		this.inputsMap.delete(id)
	}

	/** @param {string} id */
	deleteOutput(id) {
		const output = this.outputsMap.get(id)
		output.remove()
		this.outputsMap.delete(id)
	}

	/** @param {string} id */
	input(id) {
		if (!this.inputsMap.has(id))
			throw new Error(`flow-view input not found id=${id}`)
		return this.inputsMap.get(id)
	}

	/** @param {string} id */
	output(id) {
		if (!this.outputsMap.has(id))
			throw new Error(`flow-view node not found id=${id}`)
		return this.outputsMap.get(id)
	}

	/** @param {FlowViewInputObj} arg */
	newInput({ id = '', name }) {
		const item = new FlowViewInput({ id: id, node: this })
		if (name) item.info.textContent = name
		this.inputsMap.set(id, item)
		this.inputsDiv.appendChild(item.container.element)
	}


	/** @param {FlowViewOutputObj} arg */
	newOutput({ id = '', name }) {
		const item = new FlowViewOutput({ id, node: this })
		if (name) item.info.textContent = name
		this.outputsMap.set(item.id, item)
		this.outputsDiv.appendChild(item.container.element)
	}
}
