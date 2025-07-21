import { cssModifierHasError, cssModifierHighlighted } from "./theme.js"

/**
 * @typedef {import('./types').FlowViewBaseConstructorArg} FlowViewBaseConstructorArg
 * @typedef {import('./element').FlowViewElement} FlowViewElement
 */

export class FlowViewBase {
	/**
	 * @param {FlowViewElement} view
	 * @returns {string}
	 */
	static generateId(view) {
		const id = Math.random()
			.toString(36)
			.replace(/[^a-z]+/g, "")
			.substring(0, 5)

		// @ts-ignore
		if (view.shadowRoot.getElementById(id)) {
			return FlowViewBase.generateId(view)
		} else return id
	}

	/** @param {FlowViewBaseConstructorArg} arg */
	constructor({ cssClassName, id, view, ...rest }) {
		const _id = id || FlowViewBase.generateId(view)

		const element = (this.element = document.createElement("div"))
		element.setAttribute("id", _id)
		element.classList.add(cssClassName)
		// @ts-ignore
		view.shadowRoot.appendChild(element)
		this.view = view

		this._selected = false
		this.cssClassName = cssClassName

		// @ts-ignore
		this.init(rest)
	}

	dispose() {}

	get bounds() {
		return this.element.getBoundingClientRect()
	}

	get id() {
		return this.element.getAttribute("id")
	}

	set hasError(value) {
		const cssClassName = cssModifierHasError(this.cssClassName)

		if (value) {
			this.element.classList.add(cssClassName)
			this._hasError = true
		} else {
			this.element.classList.remove(cssClassName)
			this._hasError = false
		}
	}

	get hasError() {
		return this._hasError
	}

	/** @param {boolean} value */
	set highlight(value) {
		if (this.hasError) return
		const cssClassName = cssModifierHighlighted(this.cssClassName)

		if (value) this.element.classList.add(cssClassName)
		else this.element.classList.remove(cssClassName)
	}

	get isSelected() {
		return this._selected
	}

	/** @param {boolean} value */
	set selected(value) {
		this._selected = value ? true : false
	}

	/**
	 * @param {string} tag
	 * @param {string} cssClassName
	 */
	createElement(tag, cssClassName = '') {
		const element = document.createElement(tag)
		if (cssClassName) element.classList.add(cssClassName)
		this.element.appendChild(element)
		return element
	}

	remove() {
		this.dispose()
		this.element.remove()
	}

	toObject() {
		return {
			id: this.id
		}
	}
}
