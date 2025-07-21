import { cssModifierHasError, cssModifierHighlighted, cssTransition, cssVar } from './theme.js'
import { FlowViewPin } from './pin.js'

/**
 * @typedef {import('./types').FlowViewEdgeConstructorArg} FlowViewEdgeConstructorArg
 * @typedef {import('./types').Vector} Vector
 */

/** @param {string} tag */
const createSvg = (tag) =>
	document.createElementNS('http://www.w3.org/2000/svg', tag)

const cssClass = 'fv-edge'
const highlightedCssClass = cssModifierHighlighted(cssClass)

export class FlowViewEdge {
	isSelected = false;

	svg = createSvg('svg')
	line = createSvg('line')

	/** @type {Vector} */
	#end = { x: 0, y: 0 }
	/** @param {Vector} position */
	set end({ x, y }) {
		this.#end.x = x;
		this.#end.y = y;
	}

	/** @param {FlowViewEdgeConstructorArg} arg */
	constructor({ id, view, source, target }) {
		this.id = id
		const element = this.element = document.createElement('div');
		element.setAttribute('id', id);
		element.classList.add(FlowViewEdge.cssClassName);
		element.appendChild(this.svg)
		this.svg.appendChild(this.line)
		// @ts-ignore
		view.shadowRoot.appendChild(element);
		this.view = view;
		this.source = source;
		this.target = target;

		this._onDblclickLine = this.onDblclickLine.bind(this)
		this.line.addEventListener('dblclick', this._onDblclickLine)
		this._onPointerdownLine = this.onPointerdownLine.bind(this)
		this.line.addEventListener('pointerdown', this._onPointerdownLine)
		this._onPointerenterLine = this.onPointerenterLine.bind(this)
		this.line.addEventListener('pointerenter', this._onPointerenterLine)
		this._onPointerleaveLine = this.onPointerleaveLine.bind(this)
		this.line.addEventListener('pointerleave', this._onPointerleaveLine)
	}

	static cssClassName = cssClass
	static lineWidth = 2
	static zIndex = 0
	static style = {
		[`.${FlowViewEdge.cssClassName}`]: {
			display: 'flex',
			position: 'absolute',
			border: 0,
			'pointer-events': 'none'
		},
		[`.${FlowViewEdge.cssClassName} line`]: {
			'pointer-events': 'all',
			stroke: cssVar.connectionColor,
			'stroke-width': FlowViewEdge.lineWidth,
			...cssTransition('stroke')
		},
		[`.${cssModifierHasError(FlowViewEdge.cssClassName)} line`]: {
			stroke: cssVar.errorColor
		},
		[`.${cssModifierHighlighted(FlowViewEdge.cssClassName)} line`]: {
			stroke: cssVar.connectionColorHighlighted
		}
	}


	get isSemiEdge() {
		if (!this.source) return true
		if (!this.target) return true
		return false
	}

	remove() {
		this.element.remove()
		this.line.removeEventListener('dblclick', this._onDblclickLine)
		this.line.removeEventListener('pointerdown', this._onPointerdownLine)
		this.line.removeEventListener('pointerenter', this._onPointerenterLine)
		this.line.removeEventListener('pointerleave', this._onPointerleaveLine)
	}

	/** @param {MouseEvent} event */
	onDblclickLine(event) {
		event.stopPropagation()
		// @ts-ignore
		this.view.deleteEdge(this.id, {})
	}

	/** @param {MouseEvent} event */
	onPointerdownLine(event) {
		event.stopPropagation()
		if (this.isSemiEdge) return
		const isMultiSelection = event.shiftKey
		if (!isMultiSelection) this.view.clearSelection()
		this.view.selectEdge(this)
	}

	/** @param {boolean} value */
	set highlight(value) {
		if (value) this.element.classList.add(highlightedCssClass)
		else this.element.classList.remove(highlightedCssClass)
	}

	onPointerenterLine() {
		if (this.isSemiEdge) return
		if (this.view.semiEdge) return
		if (this.isSelected) return
			this.highlight = true
			// @ts-ignore
			this.source.highlight = true
			// @ts-ignore
			this.target.highlight = true
	}

	onPointerleaveLine() {
		const { source, target } = this
		if (!source || !target) return
		if (this.isSemiEdge) return
		if (!this.isSelected) {
			this.highlight = false
			// @ts-ignore
			if (!source.node.isSelected) {
			    // @ts-ignore
				source.highlight = false
			}
			// @ts-ignore
			if (!target.node.isSelected) {
			    // @ts-ignore
				target.highlight = false
			}
		}
	}

	updateGeometry() {
		const {
			element,
			line,
			svg,
			source,
			target,
			view: { origin: { x: originX, y: originY } }
		} = this
		const sourceCenter = source?.center
		let targetCenter = target?.center ?? this.#end;
		if (!sourceCenter || !targetCenter) return
		const { x: sourceX, y: sourceY } = sourceCenter
		const { x: targetX, y: targetY } = targetCenter
		const { size: pinSize } = FlowViewPin
		const halfPinSize = pinSize / 2

		const invertedX = targetX < sourceX
		const invertedY = targetY < sourceY

		const top = (invertedY ? targetY - halfPinSize : sourceY - halfPinSize) - originY
		const left = (invertedX ? targetX - halfPinSize : sourceX - halfPinSize) - originX
		element.style.top = `${top}px`
		element.style.left = `${left}px`

		const width = invertedX ? sourceX - targetX + pinSize : targetX - sourceX + pinSize
		element.style.width = `${width}px`
		// @ts-ignore
		svg.setAttribute('width', width)

		const height = invertedY ? sourceY - targetY + pinSize : targetY - sourceY + pinSize
		element.style.height = `${height}px`
		// @ts-ignore
		svg.setAttribute('height', height)

		const startX = invertedX ? width - halfPinSize : halfPinSize
		const startY = invertedY ? height - halfPinSize : halfPinSize

		const endX = invertedX ? halfPinSize : width - halfPinSize
		const endY = invertedY ? halfPinSize : height - halfPinSize

		// @ts-ignore
		line.setAttribute('x2', endX)
		// @ts-ignore
		line.setAttribute('y2', endY)
		// @ts-ignore
		line.setAttribute('x1', startX)
		// @ts-ignore
		line.setAttribute('y1', startY)
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
