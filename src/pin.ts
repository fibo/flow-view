import { cssModifierHighlighted, cssTransition, cssVar } from "./theme.js"
import { FlowViewBase } from "./base.js"
import { type FlowViewNode } from "./node.js"

const handledHtmlElementEvents: (keyof HTMLElementEventMap)[] = ["pointerenter", "pointerleave"]
type HandledHtmlElementEventType = (typeof handledHtmlElementEvents)[number]
type HandledHtmlElementEventMap = Pick<HTMLElementEventMap, HandledHtmlElementEventType>

export class FlowViewPin extends FlowViewBase {
	node: FlowViewNode | undefined
	name = ""
	info: HTMLPreElement | undefined

	static cssClassName = "fv-pin"
	static size = 10
	static style = {
		[`.${FlowViewPin.cssClassName}`]: {
			"background-color": cssVar.connectionColor,
			cursor: "none",
			position: "relative",
			display: "block",
			width: `${FlowViewPin.size}px`,
			height: `${FlowViewPin.size}px`,
			...cssTransition("background-color")
		},
		[`.${FlowViewPin.cssClassName} .info`]: {
			visibility: "hidden",
			position: "absolute",
			"background-color": cssVar.nodeBackgroundColor
		},
		[`.${FlowViewPin.cssClassName} .info:not(:empty)`]: {
			padding: "2px 5px"
		},
		[`.${FlowViewPin.cssClassName}:hover .info`]: {
			visibility: "visible"
		},
		[`.${cssModifierHighlighted(FlowViewPin.cssClassName)}`]: {
			"background-color": cssVar.connectionColorHighlighted
		}
	}

	// @ts-ignore
	init({ name = "", node }) {
		this.info = this.createElement("pre", "info") as HTMLPreElement

		this.name = name
		this.text = name

		this.node = node

		this.element.addEventListener("pointerdown", this)
		this.element.addEventListener("pointerenter", this)
		this.element.addEventListener("pointerleave", this)
		this.element.addEventListener("pointerup", this)
	}

	handleEvent(event: HandledHtmlElementEventMap[HandledHtmlElementEventType]) {
		if (event.type === "pointerenter") {
			this.highlight = true
		}
		if (event.type === "pointerleave") {
			this.highlight = false
		}
	}

	get offsetX() {
		if (!this.node) return 0
		return this.bounds.x - this.node.bounds.x
	}

	set text(value: string) {
		if (!this.info) return
		this.info.textContent = value === "" ? this.name : value
	}

	get halfPinSize() {
		return Math.round(FlowViewPin.size / 2)
	}

	dispose() {
		this.element.removeEventListener("pointerdown", this)
		this.element.removeEventListener("pointerenter", this)
		this.element.removeEventListener("pointerleave", this)
		this.element.removeEventListener("pointerup", this)
	}

	toObject() {
		const obj = {}
		// @ts-ignore
		if (!this.name) obj.name = this.name
		return {
			...super.toObject(),
			...obj
		}
	}
}
