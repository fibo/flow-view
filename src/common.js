import { cssModifierHighlighted } from './theme.js';

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

	/** @param {boolean} value */
	set highlight(value) {
		if (value)
			this.element.classList.add(this.highlightedCssClass);
		else
			this.element.classList.remove(this.highlightedCssClass);
	}
}

export class Connection {
	svg = createSvg('svg');
	line = createSvg('line');

	constructor() {
		this.svg.appendChild(this.line);
		this.element = this.svg;
	}

	/** @param {number} arg */
	set width(arg) {
		this.svg.setAttribute('width', `${arg}`);
	}
	/** @param {number} arg */
	set height(arg) {
		this.svg.setAttribute('height', `${arg}`);
	}

	/** @param {Vector} arg */
	set start({ x, y }) {
		this.line.setAttribute('x1', `${x}`)
		this.line.setAttribute('y1', `${y}`)
	}
	/** @param {Vector} arg */
	set end({ x, y }) {
		this.line.setAttribute('x2', `${x}`)
		this.line.setAttribute('y2', `${y}`)
	}
}
