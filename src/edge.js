import { cssModifierHasError, cssModifierHighlighted, cssTransition, cssVar } from "./theme.js"
import { FlowViewBase } from "./base.js"
import { FlowViewPin } from "./pin.js"
import { FlowViewInput } from "./input.js"
import { FlowViewOutput } from "./output.js"

export class FlowViewEdge extends FlowViewBase {
	static cssClassName = "fv-edge"
	static lineWidth = 2
	static zIndex = 0
	static style = {
		[`.${FlowViewEdge.cssClassName}`]: {
			display: "flex",
			position: "absolute",
			border: 0,
			"pointer-events": "none"
		},
		[`.${FlowViewEdge.cssClassName} line`]: {
			"pointer-events": "all",
			stroke: cssVar.connectionColor,
			"stroke-width": FlowViewEdge.lineWidth,
			...cssTransition("stroke")
		},
		[`.${cssModifierHasError(FlowViewEdge.cssClassName)} line`]: {
			stroke: cssVar.errorColor
		},
		[`.${cssModifierHighlighted(FlowViewEdge.cssClassName)} line`]: {
			stroke: cssVar.connectionColorHighlighted
		}
	}

	get hasSourcePin() {
		return this.source instanceof FlowViewOutput
	}

	get hasTargetPin() {
		return this.target instanceof FlowViewInput
	}

	get isSemiEdge() {
		return !this.hasTargetPin || !this.hasSourcePin
	}

	init({ source, target }) {
		const hasSourcePin = source instanceof FlowViewOutput
		const hasTargetPin = target instanceof FlowViewInput

		this.source = hasTargetPin && !hasSourcePin ? { center: { x: target.center.x, y: target.center.y } } : source
		this.target = hasSourcePin && !hasTargetPin ? { center: { x: source.center.x, y: source.center.y } } : target

		const svg = (this.svg = this.createSvg("svg"))
		this.element.appendChild(svg)

		const line = (this.line = this.createSvg("line"))
		svg.appendChild(line)

		this.updateGeometry()

		line.addEventListener("dblclick", this)
		line.addEventListener("pointerdown", this)
		line.addEventListener("pointerenter", this)
		line.addEventListener("pointerleave", this)
	}

	handleEvent(event) {
		if (event.type === "dblclick") {
			event.stopPropagation()
			this.view.deleteEdge(this.id)
		}
		if (event.type === "pointerdown") {
			event.stopPropagation()
			if (this.isSemiEdge) return
			const isMultiSelection = event.shiftKey
			if (!isMultiSelection) this.view.clearSelection()
			this.view.selectEdge(this)
		}
		if (event.type === "pointerenter") {
			if (this.isSemiEdge) return
			if (this.view.isDraggingEdge) return
			if (!this.isSelected) {
				this.highlight = true
				this.source.highlight = true
				this.target.highlight = true
			}
		}
		if (event.type === "pointerleave") {
			if (this.isSemiEdge) return
			if (!this.isSelected) {
				this.highlight = false
				if (!this.source.node.isSelected) {
					this.source.highlight = false
				}
				if (!this.target.node.isSelected) {
					this.target.highlight = false
				}
			}
		}
	}

	dispose() {
		this.line.removeEventListener("dblclick", this)
		this.line.removeEventListener("pointerdown", this)
		this.line.removeEventListener("pointerenter", this)
		this.line.removeEventListener("pointerleave", this)
	}

	updateGeometry() {
		const {
			element,
			line,
			svg,
			source: {
				center: { x: sourceX, y: sourceY }
			},
			target: {
				center: { x: targetX, y: targetY }
			},
			view: {
				origin: { x: originX, y: originY }
			}
		} = this
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
		svg.setAttribute("width", width)

		const height = invertedY ? sourceY - targetY + pinSize : targetY - sourceY + pinSize
		element.style.height = `${height}px`
		svg.setAttribute("height", height)

		const startX = invertedX ? width - halfPinSize : halfPinSize
		const startY = invertedY ? height - halfPinSize : halfPinSize

		const endX = invertedX ? halfPinSize : width - halfPinSize
		const endY = invertedY ? halfPinSize : height - halfPinSize

		line.setAttribute("x2", endX)
		line.setAttribute("y2", endY)
		line.setAttribute("x1", startX)
		line.setAttribute("y1", startY)
	}

	toObject() {
		if (this.isSemiEdge) return
		return {
			...super.toObject(),
			from: [this.source.node.id, this.source.id],
			to: [this.target.node.id, this.target.id]
		}
	}
}
