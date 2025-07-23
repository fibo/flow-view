import { Connection, Container } from './common.js';
import { cssClass, cssPin } from './theme.js'

/**
 * @typedef {import('./types').EdgeConstructorArg} ConstructorArg
 * @typedef {import('./types').Vector} Vector
 */

const { size: pinSize, halfSize: halfPinSize } = cssPin

export class FlowViewEdge {
	isSelected = false;

	container = new Container(cssClass.edge);
	connection = new Connection();

	/** @type {Vector} */
	#end = { x: 0, y: 0 }
	/** @param {Vector} position */
	set end({ x, y }) {
		this.#end.x = x;
		this.#end.y = y;
	}

	/** @param {ConstructorArg} arg */
	constructor({ id, view, source, target }) {
		this.id = id
		this.container.element.appendChild(this.connection.svg)
		this.view = view;
		this.source = source;
		this.target = target;

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
			this.view.deleteEdge(this.id, {});
		}
		if (event instanceof PointerEvent && event.type === 'pointerdown') {
			event.stopPropagation()
			const isMultiSelection = event.shiftKey
			this.view.selectEdge(this, isMultiSelection)
		}
		if (event.type === 'pointerenter') {
			if (this.view.semiEdge) return
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

	updateGeometry() {
		const {
			source,
			target,
			view: { origin: { x: originX, y: originY } }
		} = this
		const element = this.container.element
		const sourceCenter = source?.center
		let targetCenter = target?.center ?? this.#end;
		if (!sourceCenter || !targetCenter) return
		const { x: sourceX, y: sourceY } = sourceCenter
		const { x: targetX, y: targetY } = targetCenter

		const invertedX = targetX < sourceX
		const invertedY = targetY < sourceY

		const top = (invertedY ? targetY - halfPinSize : sourceY - halfPinSize) - originY
		const left = (invertedX ? targetX - halfPinSize : sourceX - halfPinSize) - originX
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

	toObject() {
		return {
			id: this.id,
			// @ts-ignore
			from: [this.source.node.id, this.source.id],
			// @ts-ignore
			to: [this.target.node.id, this.target.id]
		}
	}
}
