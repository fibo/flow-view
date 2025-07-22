import { cssModifierHighlighted } from './theme.js';

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
