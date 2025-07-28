import { Connection, Container } from './common.js';
import { cssClass, cssPin } from './style.js'

/**
 * @typedef {import('./input').Input} Input
 * @typedef {import('./output').Output} Output
 * @typedef {import('./types').Vector} Vector
 */

const { size: pinSize, halfSize: halfPinSize } = cssPin

export class Link {
	isSelected = false;

	container = new Container(cssClass.link);
	connection = new Connection();

	/**
	 * @param {Output} source
	 * @param {Input} target
	 * @param {{ delete: () => void, select: () => void }} action
	 */
	constructor(source, target, action) {
		this.container.element.append(this.connection.container)
		this.source = source;
		this.target = target;
		this.delete = action.delete;
		this.select = action.select;

		this.connection.line.addEventListener('dblclick', this)
		this.connection.line.addEventListener('pointerdown', this)
		this.connection.line.addEventListener('pointerenter', this)
		this.connection.line.addEventListener('pointerleave', this)
	}

	dispose() {
		this.connection.line.removeEventListener('dblclick', this)
		this.connection.line.removeEventListener('pointerdown', this)
		this.connection.line.removeEventListener('pointerenter', this)
		this.connection.line.removeEventListener('pointerleave', this)
		this.container.element.remove()
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event.type === 'dblclick') {
			event.stopPropagation();
			this.delete();
		}
		if (event instanceof PointerEvent && event.type === 'pointerdown') {
			event.stopPropagation()
			this.select();
		}
		if (event.type === 'pointerenter') {
			if (this.isSelected) return
			this.container.highlight = true
			this.source.container.highlight = true
			this.target.container.highlight = true
		}
		if (event.type === 'pointerleave') {
			const { source, target } = this
			if (!source || !target) return
			if (!this.isSelected) {
				this.container.highlight = false
				if (!source.node.isSelected) {
					source.container.highlight = false
				}
				if (!target.node.isSelected) {
					target.container.highlight = false
				}
			}
		}
	}

	/** @param {Vector} origin */
	updateGeometry(origin) {
		const element = this.container.element
		const { x: sourceX, y: sourceY } = this.source.center
		const { x: targetX, y: targetY } = this.target.center

		const invertedX = targetX < sourceX
		const invertedY = targetY < sourceY

		const top = (invertedY ? targetY - halfPinSize : sourceY - halfPinSize) - origin.y
		const left = (invertedX ? targetX - halfPinSize : sourceX - halfPinSize) - origin.x
		element.style.top = `${top}px`
		element.style.left = `${left}px`

		const width = invertedX ? sourceX - targetX + pinSize : targetX - sourceX + pinSize;
		element.style.width = `${width}px`
		this.connection.width = width;

		const height = invertedY ? sourceY - targetY + pinSize : targetY - sourceY + pinSize;
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
