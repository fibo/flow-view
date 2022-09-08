import { cssModifierHasError, cssModifierHighlighted } from "../theme.js";

export class FlowViewBase {
	static generateId(view) {
		const id = Math.random()
			.toString(36)
			.replace(/[^a-z]+/g, "")
			.substring(0, 5);

		if (view.shadowRoot.getElementById(id)) {
			return FlowViewBase.generateId(view);
		} else return id;
	}

	constructor({ cssClassName, id, view, ...rest }) {
		const _id = id || FlowViewBase.generateId(view);

		const element = (this.element = document.createElement("div"));
		element.setAttribute("id", _id);
		element.classList.add(cssClassName);
		view.shadowRoot.appendChild(element);
		this.view = view;

		this._selected = false;
		this.cssClassName = cssClassName;

		this.init(rest);
	}

	init() {}

	dispose() {}

	get bounds() {
		return this.element.getBoundingClientRect();
	}

	get id() {
		return this.element.getAttribute("id");
	}

	/**
	 * @param {Boolean} value
	 */
	set ghost(value) {
		this.element.style.opacity = value ? 0.17 : "";
	}

	/**
	 * @param {Boolean} value
	 */
	set hasError(value) {
		const cssClassName = cssModifierHasError(this.cssClassName);

		if (value) {
			this.element.classList.add(cssClassName);
			this._hasError = true;
		} else {
			this.element.classList.remove(cssClassName);
			this._hasError = false;
		}
	}

	get hasError() {
		return this._hasError;
	}

	/**
	 * @param {Boolean} value
	 */
	set highlight(value) {
		if (this.hasError) return;
		const cssClassName = cssModifierHighlighted(this.cssClassName);

		if (value) this.element.classList.add(cssClassName);
		else this.element.classList.remove(cssClassName);
	}

	get isSelected() {
		return this._selected;
	}

	/**
	 * @param {Boolean} value
	 */
	set selected(value) {
		this._selected = value ? true : false;
	}

	createElement(tag, cssClassName) {
		const element = document.createElement(tag);
		if (cssClassName) element.classList.add(cssClassName);
		this.element.appendChild(element);
		return element;
	}

	createSvg(tag) {
		return document.createElementNS("http://www.w3.org/2000/svg", tag);
	}

	remove() {
		this.dispose();
		this.element.remove();
	}

	toObject() {
		return {
			id: this.id,
		};
	}
}
