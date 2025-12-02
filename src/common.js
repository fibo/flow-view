import { cssModifierHighlighted } from './style.js';

/**
 * @typedef {import('./internals.d.ts').Dimensions} Dimensions
 * @typedef {import('./internals.d.ts').Rectangle} Rectangle
 * @typedef {import('./internals.d.ts').Vector} Vector
 * @typedef {import('./internals.d.ts').VectorOperator} VectorOperator
 */

/**
 * @template {keyof HTMLElementTagNameMap} T
 * @param {T} tag
 * @param {(Record<string, string> | null)=} attributes
 * @param {Array<number | string | HTMLElement>=} children
 * @returns {HTMLElementTagNameMap[T]}
 */
export const createHtml = (tag, attributes = null, children = []) => {
	const element = document.createElement(tag);
	if (attributes)
		for (const [key, value] of Object.entries(attributes))
			element.setAttribute(key, value);
	for (const child of children)
		if (typeof child === 'number' || typeof child === 'string')
			element.appendChild(document.createTextNode(child.toString()));
	return element;
}

/**
 * @param {string} cssClass
 * @param {Array<number | string | HTMLElement>=} children
 */
export const div = (cssClass, children = []) => createHtml('div', { class: cssClass }, children);

/**
 * @param {string} tag
 * @returns {SVGElement}
 */
export const createSvg = (tag) => document.createElementNS('http://www.w3.org/2000/svg', tag);

/** @param {{ ctrlKey: boolean; metaKey: boolean }} event */
export const ctrlOrMeta = (event) => event.ctrlKey || event.metaKey;

/** @param {Event} event */
export const prevent = (event) => event.preventDefault();
/** @param {Event} event */
export const stop = (event) => event.stopPropagation();

/**
 * @param {number} x
 * @param {number} y
 * @returns {Vector}
 */
const xy = (x, y) => ({ x, y })

export const vector = {
	xy,
	/** @type {VectorOperator} */
	add: (a, b) => xy(a.x + b.x, a.y + b.y),
    /** @type {VectorOperator} */
    sub: (a, b) => xy(a.x - b.x, a.y - b.y),
}

/** @implements {Rectangle} */
export class Container {
	/** Position in viewport coordinates */
	position = xy(0, 0);
	/** @type {Dimensions} */
	dimensions = { width: 0, height: 0 };
	#highlightedCssClass;

	/** @param {string} cssClass */
	constructor(cssClass) {
		this.element = div(cssClass);
		this.#highlightedCssClass = cssModifierHighlighted(cssClass);
	}

	setElementDimensions() {
		this.element.style.width = `${this.dimensions.width}px`
		this.element.style.height = `${this.dimensions.height}px`
	}

	setElementPosition() {
		this.element.style.left = `${this.position.x}px`
		this.element.style.top = `${this.position.y}px`
	}

	/** @param {boolean} value */
	set highlight(value) {
		if (value)
			this.element.classList.add(this.#highlightedCssClass);
		else
			this.element.classList.remove(this.#highlightedCssClass);
	}

	/** @param {Rectangle} target */
	intersects(target) {
		return (
			target.position.x < this.position.x + this.dimensions.width &&
			target.position.x + target.dimensions.width > this.position.x &&
			target.position.y < this.position.y + this.dimensions.height &&
			target.position.y + target.dimensions.height > this.position.y
		)
	}
}
