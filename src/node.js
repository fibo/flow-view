import { cssModifierHasError, cssModifierHighlighted, cssTransition, cssVar, cssNode, cssClass, cssPin } from "./theme.js"
import { FlowViewInput } from "./input.js"
import { FlowViewOutput } from "./output.js"

/**
 * @typedef {import('./types').FlowViewNodeConstructorArg} FlowViewNodeConstructorArg
 * @typedef {import('./types').FlowViewNodeObj} FlowViewNodeObj
 * @typedef {import('./types').FlowViewOutputObj} FlowViewOutputObj
 * @typedef {import('./types').FlowViewInputObj} FlowViewInputObj
 * @typedef {import('./types').Vector} Vector
 */

const highlightedCssClass = cssModifierHighlighted(cssClass.node)

/** @param {string} cssClass */
const div = (cssClass) => {
	const element = document.createElement('div');
	element.classList.add(cssClass);
	return element;
}

export class FlowViewNode {
	static style = {
		[`.${cssClass.node}`]: {
			position: "absolute",
			"background-color": cssVar.nodeBackgroundColor,
			"border-radius": cssVar.borderRadius,
			"box-shadow": cssVar.boxShadow,
			display: "flex",
			"flex-direction": "column",
			"justify-content": "space-between",
			border: `${cssNode.borderWidth}px solid transparent`,
			"min-height": `${cssNode.minSize}px`,
			"min-width": `${cssNode.minSize}px`,
			width: "fit-content",
			"z-index": cssNode.zIndex,
			...cssTransition("border-color")
		},
		[`.${cssModifierHighlighted(cssClass.node)}`]: {
			"border-color": cssVar.borderColorHighlighted
		},
		[`.${cssModifierHasError(cssClass.node)}`]: {
			"border-color": cssVar.errorColor
		},
		[`.${cssClass.node} .content`]: {
			"user-select": "none",
			"padding-left": "0.5em",
			"padding-right": "0.5em",
			"text-align": "center"
		},
		[`.${cssClass.node} .pins`]: {
			display: "flex",
			"flex-direction": "row",
			gap: `${cssPin.size}px`,
			"justify-content": "space-between",
			height: `${cssPin.size}px`
		}
	}

    #x = 0; #y = 0;

	isSelected = false;
	inputsMap = new Map()
	outputsMap = new Map()
	inputsDiv = div('pins');
	outputsDiv = div('pins');
	contentDiv = div('content');

	/** @param {FlowViewNodeConstructorArg} arg */
	constructor({ id, text, type, view, x, y }) {
		this.id = id
		this.text = text
		this.type = type
		const element = this.element = document.createElement('div');
		element.setAttribute('id', id);
		element.classList.add(cssClass.node);
		element.appendChild(this.inputsDiv);
		element.appendChild(this.contentDiv);
		element.appendChild(this.outputsDiv);
		// @ts-ignore
		view.shadowRoot.appendChild(element);
		this.view = view;
		this.position = { x, y }
		this._onDblclick = this.onDblclick.bind(this)
		this.element.addEventListener("dblclick", this._onDblclick)
		this._onPointerdown = this.onPointerdown.bind(this)
		this.element.addEventListener("pointerdown", this._onPointerdown)
	}

	/** @param {boolean} value */
	set highlight(value) {
		if (value) this.element.classList.add(highlightedCssClass)
		else this.element.classList.remove(highlightedCssClass)
	}

	get bounds() {
		return this.element.getBoundingClientRect()
	}

	/**
	 * @param {string} tag
	 * @param {string} cssClass
	 */
	createElement(tag, cssClass) {
		const element = document.createElement(tag)
		element.classList.add(cssClass)
		this.element.appendChild(element)
		return element
	}

	/** @param {FlowViewNodeObj} node */
	initContent(node) {
		this.contentDiv.textContent = node.text
	}

	dispose() {
		this.element.removeEventListener("dblclick", this._onDblclick)
		this.element.removeEventListener("pointerdown", this._onPointerdown)
		for (const input of this.inputs) input.dispose()
		for (const output of this.outputs) output.dispose()
	}

	get inputs() {
		return [...this.inputsMap.values()]
	}

	get outputs() {
		return [...this.outputsMap.values()]
	}

	/** @returns {Vector} */
	get position() {
		return { x: this.#x, y: this.#y }
	}

	set position({ x, y }) {
		this.#x = x; this.#y = y;
		this.element.style.top = `${y - this.view.origin.y}px`
		this.element.style.left = `${x - this.view.origin.x}px`
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
	newInput({ id, name }) {
		const pin = new FlowViewInput({
			id,
		// @ts-ignore
			name,
			node: this,
			view: this.view,
			cssClassName: cssClass.pin
		})
		this.inputsMap.set(pin.id, pin)
		this.inputsDiv.appendChild(pin.element)
	}


	/** @param {FlowViewOutputObj} arg */
	newOutput({ id, name }) {
		const pin = new FlowViewOutput({
			id,
		// @ts-ignore
			name,
			node: this,
			view: this.view,
			cssClassName: cssClass.pin
		})
		this.outputsMap.set(pin.id, pin)
		this.outputsDiv.appendChild(pin.element)
	}

	/** @param {MouseEvent} event */
	onDblclick(event) {
		event.stopPropagation()
	}

	/** @param {MouseEvent} event */
	onPointerdown(event) {
		// @ts-ignore
		if (event.isBubblingFromPin) return
		// @ts-ignore
		event.isBubblingFromNode = true
		const isMultiSelection = event.shiftKey || (this.view.hasSelectedNodes && this.isSelected)
		if (!isMultiSelection) this.view.clearSelection()
		this.view.selectNode(this)
	}

	toObject() {
		const { text, inputs, outputs, position } = this
		return {
			id: this.id,
			...position,
			text,
			...(inputs.length > 0
				? {
						ins: inputs.map((pin) => pin.toObject())
				  }
				: {}),
			...(outputs.length > 0
				? {
						outs: outputs.map((pin) => pin.toObject())
				  }
				: {})
		}
	}
}
