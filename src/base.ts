import { cssModifierHasError, cssModifierHighlighted } from "./theme.js"
import { type FlowViewElement } from "./element.js"

export class FlowViewBase {
	private _hasError: boolean | undefined
	private _selected: boolean | undefined
	cssClassName: string
	view: FlowViewElement
	element: HTMLDivElement

	static generateId(view: FlowViewElement): string {
		const id = Math.random()
			.toString(36)
			.replace(/[^a-z]+/g, "")
			.substring(0, 5)

		// TODO view.getElementById
		if (view.shadowRoot?.getElementById(id)) {
			return FlowViewBase.generateId(view)
		} else return id
	}

	constructor({
		cssClassName,
		id,
		view,
		...rest
	}: {
		cssClassName: string
		id: string
		view: FlowViewElement
	}) {
		const _id = id || FlowViewBase.generateId(view)

		const element = document.createElement("div")
		element.setAttribute("id", _id)
		element.classList.add(cssClassName)
		this.element = element

		// TODO view.appendChild
		view.shadowRoot?.appendChild(element)
		this.view = view

		this.cssClassName = cssClassName

		// @ts-ignore
		this.init(rest)
	}

	init() {}

	dispose() {}

	get bounds() {
		return this.element.getBoundingClientRect()
	}

	get id() {
		return this.element.getAttribute("id")
	}

	set ghost(value: any) {
		this.element.style.opacity = value ? "0.17" : ""
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

	set highlight(value: any) {
		if (this.hasError) return
		const cssClassName = cssModifierHighlighted(this.cssClassName)

		if (value) this.element.classList.add(cssClassName)
		else this.element.classList.remove(cssClassName)
	}

	get isSelected() {
		return this._selected
	}

	set selected(value: unknown) {
		this._selected = value ? true : false
	}

	createElement(tag: keyof HTMLElementTagNameMap, cssClassName: string) {
		const element = document.createElement(tag)
		if (cssClassName) element.classList.add(cssClassName)
		this.element.appendChild(element)
		return element
	}

	createSvg(tag: keyof SVGElementTagNameMap) {
		return document.createElementNS("http://www.w3.org/2000/svg", tag)
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
