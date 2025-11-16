import { cssModifierHighlighted } from './style.js';

/**
 * @typedef {import('./types').Dimensions} Dimensions
 * @typedef {import('./types').Rectangle} Rectangle
 * @typedef {import('./types').Vector} Vector
 * @typedef {import('./types').VectorOperator} VectorOperator
 */

/** @param {string} cssClass */
export const createDiv = (cssClass) => {
	const element = document.createElement('div');
	element.classList.add(cssClass);
	return element;
}

/** @param {string} tag */
export const createSvg = (tag) => document.createElementNS('http://www.w3.org/2000/svg', tag);

/** @param {{ ctrlKey: boolean; metaKey: boolean }} event */
export const ctrlOrMeta = (event) => event.ctrlKey || event.metaKey;

/** @param {Event} event */
export const prevent = (event) => event.preventDefault();
/** @param {Event} event */
export const stop = (event) => event.stopPropagation();

export const vector = {
	/** @type {VectorOperator} */
	add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y }),
    /** @type {VectorOperator} */
    sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y }),
	/** @type {() => Vector} */
	zero: () => ({ x: 0, y: 0 }),
}

/** @implements {Rectangle} */
export class Container {
	/** Position in viewport coordinates */
	position = vector.zero();
	/** @type {Dimensions} */
	dimensions = { width: 0, height: 0 };
	#highlightedCssClass;

	/** @param {string} cssClass */
	constructor(cssClass) {
		this.element = createDiv(cssClass);
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
