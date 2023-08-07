import { FlowViewErrorItemNotFound } from "./errors.js"
import { FlowViewBase } from "./base.js"
import { FlowViewEdge } from "./edge.js"
import { FlowViewNode } from "./node.js"
import { FlowViewPin } from "./pin.js"
import { FlowViewSelector } from "./selector.js"
import { cssTheme, cssVar } from "./theme.js"
import { type FlowViewOnChangeInfo } from "./flow-view.js"

type Vector = {
	x: number
	y: number
}

const handledHtmlElementEvents: (keyof HTMLElementEventMap)[] = [
	"contextmenu",
	"dblclick",
	"keydown",
	"pointerdown",
	"pointerleave",
	"pointerup",
	"touchmove"
]
type HandledHtmlElementEventType = (typeof handledHtmlElementEvents)[number]
type HandledHtmlElementEventMap = Pick<
	HTMLElementEventMap,
	HandledHtmlElementEventType
>
const handledHtmlElementEventOptions: {
	[eventType in HandledHtmlElementEventType]?: AddEventListenerOptions
} = {
	touchmove: { passive: false }
}

const defaultItems = {
	edge: FlowViewEdge,
	node: FlowViewNode
} as const

export class FlowViewElement extends HTMLElement {
	_origin: Vector
	edgesMap: Map<string, FlowViewEdge>
	nodesMap: Map<string, FlowViewNode>
	selectorId: string
	rootResizeObserver: ResizeObserver | undefined
	// TODO private itemClassMap ??
	selector: FlowViewSelector | undefined
	semiEdge: FlowViewEdge | undefined
	startDraggingPoint: Vector | undefined
	translateVector: Vector | undefined

	static customElementName = "flow-view"
	static minHeight = 200

	static style = {
		":host([hidden])": { display: "none" },
		":host": {
			position: "relative",
			display: "block",
			overflow: "hidden",
			border: 0,
			margin: 0,
			outline: 0,
			"background-color": cssVar.backgroundColor,
			"border-radius": cssVar.borderRadius,
			"font-family": cssVar.fontFamily,
			"font-size": cssVar.fontSize,
			color: cssVar.textColor
		},
		...FlowViewEdge.style,
		...FlowViewNode.style,
		...FlowViewPin.style,
		...FlowViewSelector.style
	}

	// @ts-ignore
	static generateStylesheet(style) {
		return Object.entries(style).reduce(
			(stylesheet, [selector, rules]) =>
				[
					stylesheet,
					`${selector}{`,
					// @ts-ignore
					Object.entries(rules)
						.map(([key, value]) => `${key}:${value};`)
						.join(""),
					"}"
				].join(""),
			""
		)
	}

	static pointerCoordinates(event: MouseEvent): Vector | undefined {
		if (!event.target) return
		// @ts-ignore
		const { left, top } = event.target.getBoundingClientRect()
		return {
			x: Math.round(event.clientX - left),
			y: Math.round(event.clientY - top)
		}
	}

	constructor() {
		super()

		const template = document.createElement("template")

		const hasLight = this.hasAttribute("light")
		const hasDark = this.hasAttribute("dark")
		const isLight = hasLight && !hasDark
		const isDark = !hasLight && hasDark

		const { generateStylesheet } = FlowViewElement
		const lightStyle = generateStylesheet({ ":host": cssTheme("light") })
		const darkStyle = generateStylesheet({ ":host": cssTheme("dark") })

		template.innerHTML = [
			"<style>",
			generateStylesheet(FlowViewElement.style),
			generateStylesheet({
				":host": {
					"color-scheme": isLight
						? "light"
						: isDark
						? "dark"
						: "light dark"
				}
			}),
			...(isLight
				? lightStyle
				: isDark
				? darkStyle
				: [
						lightStyle,
						`@media(prefers-color-scheme:dark){${darkStyle}}`
				  ]),
			"</style>"
		].join("")

		this.attachShadow({ mode: "open" }).appendChild(
			template.content.cloneNode(true)
		)

		this._origin = { x: 0, y: 0 }

		this.nodesMap = new Map()
		this.edgesMap = new Map()

		// @ts-ignore
		this.itemClassMap = new Map()
		Object.entries(defaultItems).forEach(([key, Class]) => {
			// @ts-ignore
			this.itemClassMap.set(key, Class)
		})

		this.selectorId = `selector-${FlowViewBase.generateId(this)}`
	}

	connectedCallback() {
		if ("ResizeObserver" in window) {
			if (this.parentNode instanceof Element) {
				this.rootResizeObserver = new ResizeObserver((entries) => {
					// Only listen to parentNode
					for (const entry of entries) {
						if (this.parentNode === entry.target) {
							// Try with contentBoxSize
							const contentBoxSize = Array.isArray(
								entry.contentBoxSize
							)
								? entry.contentBoxSize[0]
								: entry.contentBoxSize
							if (contentBoxSize) {
								this.width = contentBoxSize.inlineSize
								this.height = contentBoxSize.blockSize
							} else {
								// Fallback to contentRect
								if (entry.contentRect) {
									this.width = entry.contentRect.width
									this.height = entry.contentRect.height
								}
							}
						}
					}
				})
				this.rootResizeObserver.observe(this.parentNode)
			}
		} else {
			// TODO observe attribute height
			// @ts-ignore
			this.height =
				this.getAttribute("height") || FlowViewElement.minHeight
		}

		if (!this.getAttribute("tabindex")) this.setAttribute("tabindex", "0")

		handledHtmlElementEvents.forEach((type) =>
			this.addEventListener(
				type,
				this,
				handledHtmlElementEventOptions[type] ?? false
			)
		)
		this.addEventListener("keydown", this.onKeydown)
		this.addEventListener("pointerdown", this.onPointerdown)
		this.addEventListener("pointermove", this.onPointermove)
		this.addEventListener("pointerleave", this.onPointerleave)
		this.addEventListener("pointerup", this.onPointerup)
		this.addEventListener("touchmove", this.onTouchmove, {
			passive: false
		})
	}

	disconnectedCallback() {
		Object.keys(handledHtmlElementEvents).forEach((type) =>
			this.removeEventListener(type, this)
		)
		this.removeEventListener("keydown", this.onKeydown)
		this.removeEventListener("pointerdown", this.onPointerdown)
		this.removeEventListener("pointermove", this.onPointermove)
		this.removeEventListener("pointerleave", this.onPointerleave)
		this.removeEventListener("pointerup", this.onPointerup)

		if (this.parentNode instanceof Element)
			this.rootResizeObserver?.unobserve(this.parentNode)
		delete this.rootResizeObserver
	}

	handleEvent(
		event: HandledHtmlElementEventMap[HandledHtmlElementEventType]
	) {
		switch (event.type) {
			case "contextmenu":
				event.preventDefault()
				break

			case "dblclick": {
				this.clearSelection()
				this.removeSelector()

				// @ts-ignore
				const pointerPosition =
					FlowViewElement.pointerCoordinates(event)
				if (!pointerPosition) return

				const selector = this.createSelector({
					position: {
						x: pointerPosition.x + this.origin.x,
						y: pointerPosition.y + this.origin.y
					}
				})
				selector.focus()
				break
			}

			case "touchmove":
				event.preventDefault()
				event.stopPropagation()
				break

			default:
				break
		}
	}

	get origin(): Vector {
		if (this.translateVector && !this.hasSelectedNodes) {
			return {
				x: this._origin.x + this.translateVector.x,
				y: this._origin.y + this.translateVector.y
			}
		} else {
			return this._origin
		}
	}

	get selectedEdges() {
		return this.edges.filter((edge) => edge.isSelected)
	}

	get hasSelectedNodes() {
		return this.selectedNodes.length > 0
	}

	get isDraggingEdge() {
		return this.semiEdge instanceof FlowViewEdge
	}

	get selectedNodeIds() {
		return this.selectedNodes.map((node) => node.id)
	}

	get selectedNodes() {
		return this.nodes.filter((node) => node.isSelected)
	}

	get edges() {
		return [...this.edgesMap.values()]
	}

	get nodes() {
		return [...this.nodesMap.values()]
	}

	get height() {
		return parseInt(this.style.height)
	}

	set height(value) {
		this.style.height = `${value}px`
	}

	get width() {
		return parseInt(this.style.width)
	}

	set width(value) {
		this.style.width = `${value}px`
	}

	// @ts-ignore
	clear(viewChangeInfo) {
		this.nodes.forEach((node) => {
			this.deleteNode(node.id, viewChangeInfo)
		})
	}

	newEdge({ id, source, target }, viewChangeInfo) {
		const Class = this.itemClassMap.get("edge")
		const edge = new Class({
			id,
			view: this,
			cssClassName: Class.cssClassName,
			source,
			target
		})
		this.edgesMap.set(edge.id, edge)
		this.host.viewChange({ createdEdge: edge.toObject() }, viewChangeInfo)
		return edge
	}

	newNode(
		{ x = 0, y = 0, text, id, type, ins = [], outs = [] },
		viewChangeInfo
	) {
		const nodeType =
			this.host.textToType(text) ??
			this.host.nodeNameTypeMap.get(text) ??
			type
		const nodeTypeDefinition = this.host.nodeTypeDefinitionMap.get(nodeType)
		const inputs =
			nodeTypeDefinition?.inputs?.map((item, i) => ({
				...item,
				...(ins[i] ?? {})
			})) ?? ins
		const outputs =
			nodeTypeDefinition?.outputs?.map((item, i) => ({
				...item,
				...(outs[i] ?? {})
			})) ?? outs
		const Class =
			this.itemClassMap.get(nodeType) ?? this.itemClassMap.get("node")
		const node = new Class({
			id,
			view: this,
			cssClassName: Class.cssClassName,
			text,
			inputs,
			outputs,
			x,
			y,
			type: nodeType
		})
		this.nodesMap.set(node.id, node)
		const createdNode = nodeType
			? { ...node.toObject(), type: nodeType }
			: node.toObject()
		this.host.viewChange({ createdNode }, viewChangeInfo)
		return node
	}

	selectEdge(edge) {
		edge.highlight = true
		edge.selected = true
		edge.source.highlight = true
		edge.target.highlight = true
	}

	selectNode(node) {
		node.highlight = true
		node.selected = true
		for (const edge of this.edges) {
			if (edge.source.node.isSelected && edge.target.node.isSelected) {
				this.selectEdge(edge)
			} else {
				this.deselectEdge(edge)
			}
		}
	}

	deselectEdge(edge) {
		edge.highlight = false
		edge.selected = false
		if (!edge.source.node.isSelected) edge.source.highlight = false
		if (!edge.target.node.isSelected) edge.target.highlight = false
	}

	deselectNode(node) {
		node.highlight = false
		node.selected = false
		for (const input of node.inputs) input.highlight = false
		for (const output of node.outputs) output.highlight = false
	}

	deleteEdge(id: string, viewChangeInfo?: FlowViewOnChangeInfo) {
		const edge = this.edgesMap.get(id)
		if (!edge) return

		// @ts-ignore
		edge.source.highlight = false
		// @ts-ignore
		edge.target.highlight = false

		// Dispose.
		// @ts-ignore
		this.edgesMap.delete(edge.id)
		edge.remove()

		const serializedEdge = edge.toObject()
		this.host.viewChange({ deletedEdge: serializedEdge }, viewChangeInfo)
		return serializedEdge
	}

	deleteNode(id: string, viewChangeInfo?: FlowViewOnChangeInfo) {
		const node = this.nodesMap.get(id)
		if (!node) return

		// Remove edges connected to node.
		for (const edge of this.edges) {
			// @ts-ignore
			if (
				edge.source.node.id === node.id ||
				edge.target.node.id === node.id
			) {
				// @ts-ignore
				this.deleteEdge(edge.id, viewChangeInfo)
			}
		}

		// Dispose.
		// @ts-ignore
		this.nodesMap.delete(node.id)
		node.remove()

		const serializedNode = node.toObject()
		this.host.viewChange({ deletedNode: serializedNode }, viewChangeInfo)
		return serializedNode
	}

	edge(id: string) {
		if (!this.edgesMap.has(id))
			throw new FlowViewErrorItemNotFound("edge", id)
		return this.edgesMap.get(id)
	}

	node(id: string) {
		if (!this.nodesMap.has(id)) {
			throw new FlowViewErrorItemNotFound("node", id)
		}
		return this.nodesMap.get(id)
	}

	startTranslation(event) {
		this.startDraggingPoint = FlowViewElement.pointerCoordinates(event)
		this.translateVector = { x: 0, y: 0 }
		if (this.hasSelectedNodes) {
			const selectedNodesStartPosition = {}
			for (const node of this.selectedNodes)
				selectedNodesStartPosition[node.id] = node.position
			this.selectedNodesStartPosition = selectedNodesStartPosition
		}
	}

	stopTranslation() {
		if (this.translateVector && !this.hasSelectedNodes && !this.semiEdge) {
			this._origin = {
				x: this._origin.x + this.translateVector.x,
				y: this._origin.y + this.translateVector.y
			}
		}
		delete this.translateVector
		delete this.startDraggingPoint
		delete this.selectedNodesStartPosition
	}

	createSelector({ position }) {
		return (this.selector = new FlowViewSelector({
			id: this.selectorId,
			view: this,
			cssClassName: FlowViewSelector.cssClassName,
			position,
			nodeNames: [...this.host.nodeNameTypeMap.keys()]
		}))
	}

	updateNode({ node }) {
		this.host.viewChange({ updatedNode: node.toObject() })
	}

	onKeydown(event: GlobalEventHandlersEventMap["keydown"]) {
		event.stopPropagation()

		switch (true) {
			case this.selector instanceof FlowViewSelector:
				return
			case event.code === "Backspace":
				this.deleteSelectedItems()
				break
			case event.code === "Escape":
				this.clearSelection()
				break
			default:
				break
		}
	}

	onPointerdown(event: GlobalEventHandlersEventMap["pointerdown"]) {
		event.stopPropagation()
		this.removeSelector()
		// @ts-ignore
		if (!event.isBubblingFromNode) this.clearSelection()
		const isMultiSelection = event.shiftKey
		if (!isMultiSelection) this.startTranslation(event)
	}

	onPointermove(event: GlobalEventHandlersEventMap["pointermove"]) {
		const { hasSelectedNodes, semiEdge, startDraggingPoint } = this

		if (startDraggingPoint) {
			const pointerPosition = FlowViewElement.pointerCoordinates(event)
			const x = startDraggingPoint.x - pointerPosition.x
			const y = startDraggingPoint.y - pointerPosition.y

			switch (true) {
				case !!semiEdge: {
					if (!semiEdge.hasTarget) {
						semiEdge.target.center.x =
							pointerPosition.x + this.origin.x
						semiEdge.target.center.y =
							pointerPosition.y + this.origin.y
					}
					semiEdge.updateGeometry()
					break
				}

				case hasSelectedNodes: {
					this.translateVector = { x, y }
					const {
						edges,
						selectedNodes,
						selectedNodeIds,
						selectedNodesStartPosition
					} = this

					for (const node of selectedNodes) {
						const { x: startX, y: startY } =
							selectedNodesStartPosition[node.id]
						node.position = { x: startX - x, y: startY - y }
					}
					for (const edge of edges) {
						if (
							selectedNodeIds.includes(edge.source.node.id) ||
							selectedNodeIds.includes(edge.target.node.id)
						) {
							edge.updateGeometry()
						}
					}

					break
				}

				default: {
					this.translateVector = { x, y }
					const { nodes, edges } = this

					for (const node of nodes) {
						// Just trigger position setter, since it reads view origin.
						const { x, y } = node.position
						node.position = { x, y }
					}

					for (const edge of edges) {
						edge.updateGeometry()
					}
				}
			}
		}
	}

	onPointerleave() {
		this.stopTranslation()
		this.removeSemiEdge()
	}

	onPointerup() {
		this.stopTranslation()
		this.removeSemiEdge()
	}

	onRootResize(entries) {
		// Only listen to parentNode
		for (const entry of entries) {
			if (this.parentNode === entry.target) {
				// Try with contentBoxSize
				const contentBoxSize = Array.isArray(entry.contentBoxSize)
					? entry.contentBoxSize[0]
					: entry.contentBoxSize
				if (contentBoxSize) {
					this.width = contentBoxSize.inlineSize
					this.height = contentBoxSize.blockSize
				} else {
					// Fallback to contentRect
					if (entry.contentRect) {
						this.width = entry.contentRect.width
						this.height = entry.contentRect.height
					}
				}
			}
		}
	}

	createSemiEdge(
		{ source, target }: Partial<Pick<FlowViewEdge, "source" | "target">>,
		viewChangeInfo?: FlowViewOnChangeInfo
	) {
		// @ts-ignore
		const Class = this.itemClassMap.get("edge")
		this.semiEdge = new Class({
			view: this,
			cssClassName: Class.cssClassName,
			source,
			target
		})
		this.host.viewChange(
			{
				createdSemiEdge: {
					from:
						source instanceof FlowViewPin
							? [source.node.id, source.id]
							: undefined,
					to:
						target instanceof FlowViewPin
							? [target.node.id, target.id]
							: undefined
				}
			},
			viewChangeInfo
		)
	}

	clearSelection() {
		for (const node of this.selectedNodes) this.deselectNode(node)
		for (const edge of this.selectedEdges) this.deselectEdge(edge)
	}

	deleteSelectedItems() {
		for (const edge of this.selectedEdges) this.deleteEdge(edge.id)
		for (const node of this.selectedNodes) this.deleteNode(node.id)
	}

	removeSemiEdge() {
		if (!this.semiEdge) return
		const { source, target } = this.semiEdge
		this.semiEdge.remove()
		delete this.semiEdge
		this.host.viewChange({
			deletedSemiEdge: {
				from:
					source instanceof FlowViewPin
						? [source.node.id, source.id]
						: undefined,
				to:
					target instanceof FlowViewPin
						? [target.node.id, target.id]
						: undefined
			}
		})
	}

	removeSelector() {
		if (this.selector instanceof FlowViewSelector) this.selector.remove()
		this.selector = undefined
	}
}
