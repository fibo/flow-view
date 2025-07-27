import { Connection, Container } from './common.js';
import { cssClass, cssPin } from './theme.js'

/**
 * @typedef {import('./types').Vector} Vector
 */

const { size: pinSize, halfSize: halfPinSize } = cssPin

export class SemiEdge {
	container = new Container(cssClass.edge);
	connection = new Connection();

	#start = { x: 0, y: 0 }
	#end = { x: 0, y: 0 }
	/** @param {Vector} position */
	set end({ x, y }) {
		this.#end.x = x;
		this.#end.y = y;
	}

	/** @param {{ origin: Vector, position: Vector }} arg */
	constructor({ origin, position }) {
		this.container.element.append(this.connection.container)
		this.origin = origin;
		this.#start = {...position};
		this.#end = {...position};
	}

	dispose() {
		this.container.element.remove();
	}

	updateGeometry() {
		const { container: { element }, origin: { x: originX, y: originY } } = this;
		const { x: startX, y: startY } = this.#start;
		const { x: endX, y: endY } = this.#end;

		const invertedX = endX < startX
		const invertedY = endY < startY

		const top = (invertedY ? endY - halfPinSize : startY - halfPinSize) - originY
		const left = (invertedX ? endX - halfPinSize : startX - halfPinSize) - originX
		element.style.top = `${top}px`
		element.style.left = `${left}px`

		const width = invertedX ? startX - endX + pinSize : endX - startX + pinSize;
		element.style.width = `${width}px`
		this.connection.width = width;

		const height = invertedY ? startY - endY + pinSize : endY - startY + pinSize;
		element.style.height = `${height}px`
		this.connection.height = height;

		this.connection.start = {
			x: invertedX ? width - halfPinSize : halfPinSize,
			y: invertedY ? height - halfPinSize : halfPinSize
		};
		this.connection.end = {
			x: invertedX ? halfPinSize : width - halfPinSize,
			y: invertedY ? halfPinSize : height - halfPinSize
		};
	}
}
