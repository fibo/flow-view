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
	element = document.createElement('div');

	/** @param {string} cssClass */
	constructor(cssClass) {
		this.element = createDiv(cssClass);
		this.highlightedCssClass = cssModifierHighlighted(cssClass);
	}

	get bounds() { return this.element.getBoundingClientRect() }

	/** @param {number} value */
	set top(value) { this.element.style.top = `${value}px` }
	/** @param {number} value */
	set left(value) { this.element.style.left = `${value}px` }

	/** @param {number} value */
	set width(value) { this.element.style.width = `${value}px` }
	/** @param {number} value */
	set height(value) { this.element.style.height = `${value}px` }

	/** @param {boolean} value */
	set highlight(value) {
		if (value)
			this.element.classList.add(this.highlightedCssClass);
		else
			this.element.classList.remove(this.highlightedCssClass);
	}
}
