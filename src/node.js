import { cssModifierHasError, cssModifierHighlighted, cssTransition, cssVar, cssNode, cssClass, cssPin } from "./theme.js"
import { FlowViewBase } from "./base.js"
import { FlowViewInput } from "./input.js"
import { FlowViewOutput } from "./output.js"

/**
 * @typedef {import('./types').FlowViewNodeObj} FlowViewNodeObj
 * @typedef {import('./types').FlowViewOutputObj} FlowViewOutputObj
 * @typedef {import('./types').FlowViewInputObj} FlowViewInputObj
 * @typedef {import('./types').Vector} Vector
 */

export class FlowViewNode extends FlowViewBase {
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

	/** @param {FlowViewNodeObj} node */
	init(node) {
		// @ts-ignore
		const { text, type, inputs = [], outputs = [], x, y } = node

		this.text = text
		this.type = type

		this.inputsMap = new Map()
		this.inputsDiv = this.createElement('div', 'pins')
		for (const pin of inputs) this.newInput(pin)

		this.initContent(node)

		this.outputsMap = new Map()
		this.outputsDiv = this.createElement("div", "pins")
		for (const pin of outputs) this.newOutput(pin)

		this.position = { x, y }

		this._onDblclick = this.onDblclick.bind(this)
		this.element.addEventListener("dblclick", this._onDblclick)
		this._onPointerdown = this.onPointerdown.bind(this)
		this.element.addEventListener("pointerdown", this._onPointerdown)
	}

	/** @param {FlowViewNodeObj} node */
	initContent(node) {
		const div = this.createElement("div", "content")
		div.textContent = node.text
		this.contentDiv = div
	}

	dispose() {
		// @ts-ignore
		this.element.removeEventListener("dblclick", this._onDblclick)
		// @ts-ignore
		this.element.removeEventListener("pointerdown", this._onPointerdown)
	}

	get inputs() {
		// @ts-ignore
		return [...this.inputsMap.values()]
	}

	get outputs() {
		// @ts-ignore
		return [...this.outputsMap.values()]
	}

	/** @returns {Vector} */
	get position() {
		// @ts-ignore
		return { x: this.x, y: this.y }
	}

	// @ts-ignore
	set position({ x = 0, y = 0 } = {}) {
		const { element, view } = this

		this.x = x
		this.y = y
		element.style.top = `${y - view.origin.y}px`
		element.style.left = `${x - view.origin.x}px`
	}

	/** @param {string} id */
	deleteInput(id) {
		// @ts-ignore
		const input = this.inputsMap.get(id)
		input.remove()
		// @ts-ignore
		this.inputsMap.delete(id)
	}

	/** @param {string} id */
	deleteOutput(id) {
		// @ts-ignore
		const output = this.outputsMap.get(id)
		output.remove()
		// @ts-ignore
		this.outputsMap.delete(id)
	}

	/** @param {string} id */
	input(id) {
		// @ts-ignore
		if (!this.inputsMap.has(id))
			throw new Error(`flow-view input not found id=${id}`)
		// @ts-ignore
		return this.inputsMap.get(id)
	}

	/** @param {string} id */
	output(id) {
		// @ts-ignore
		if (!this.outputsMap.has(id))
			throw new Error(`flow-view node not found id=${id}`)
		// @ts-ignore
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
		// @ts-ignore
		this.inputsMap.set(pin.id, pin)
		// @ts-ignore
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
		// @ts-ignore
		this.outputsMap.set(pin.id, pin)
		// @ts-ignore
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
		const { text, inputs, outputs, x, y } = this
		return {
			...super.toObject(),
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
				: {}),
			x,
			y
		}
	}
}
