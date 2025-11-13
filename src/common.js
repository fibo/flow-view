import { cssModifierHighlighted } from './style.js';

/**
 * @typedef {import('./types').Vector} Vector
 */

/** @param {string} cssClass */
export const createDiv = (cssClass) => {
	const element = document.createElement('div');
	element.classList.add(cssClass);
	return element;
}

/** @param {string} tag */
export const createSvg = (tag) =>
	document.createElementNS('http://www.w3.org/2000/svg', tag);

export class Container {
	#highlightedCssClass;

	/** @param {string} cssClass */
	constructor(cssClass) {
		this.element = createDiv(cssClass);
		this.#highlightedCssClass = cssModifierHighlighted(cssClass);
	}

	get bounds() { return this.element.getBoundingClientRect() }

	/** @param {Vector} position */
	set position({ x, y }) {
		this.element.style.left = `${x}px`
		this.element.style.top = `${y}px`
	}

	/** @param {number} value */
	set width(value) { this.element.style.width = `${value}px` }
	/** @param {number} value */
	set height(value) { this.element.style.height = `${value}px` }

	/** @param {boolean} value */
	set highlight(value) {
		if (value)
			this.element.classList.add(this.#highlightedCssClass);
		else
			this.element.classList.remove(this.#highlightedCssClass);
	}
}
