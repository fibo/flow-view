import { FlowViewBaseConstructorArg } from "./base.js"
import { FlowViewPin } from "./pin.js"

const handledHtmlElementEvents: (keyof HTMLElementEventMap)[] = [
	"pointerdown",
	"pointerup"
]
type HandledHtmlElementEventType = (typeof handledHtmlElementEvents)[number]
type HandledHtmlElementEventMap = Pick<
	HTMLElementEventMap,
	HandledHtmlElementEventType
>

export class FlowViewInput extends FlowViewPin {
	constructor(args: FlowViewBaseConstructorArg) {
		super(args)
		// @ts-ignore
		this.info.style.top = "-50px"
	}

	get center() {
		if (!this.node) return { x: 0, y: 0 }
		return {
			x:
				this.node.position.x +
				this.halfPinSize +
				this.node.borderWidth +
				this.offsetX,
			y: this.node.position.y + this.halfPinSize - this.node.borderWidth
		}
	}

	get connectedEdge() {
		return [...this.view.edgesMap.values()]
			.map((edge) => edge.toObject())
			.find(
				// @ts-ignore
				({ to: [nodeId, inputId] }) =>
					nodeId === this.node?.id && inputId === this.id
			)
	}

	handleEvent(
		event: HandledHtmlElementEventMap[HandledHtmlElementEventType]
	) {
		super.handleEvent(event)
		if (event.type === "pointerdown") {
			event.stopPropagation()
		}
		if (event.type === "pointerup") {
			const { connectedEdge, view } = this
			if (view.isDraggingEdge) {
				const { semiEdge } = view
				if (semiEdge?.hasSourcePin) {
					const { source } = semiEdge
					// Delete previous edge, only one edge per input is allowed.
					// @ts-ignore
					if (connectedEdge) view.deleteEdge(connectedEdge.id)
					// Do not connect pins of same node.
					if (source?.node?.id === this.node?.id) return
					view.newEdge({ source, target: this })
				}
			}
		}
	}
}
