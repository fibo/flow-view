import { FlowViewBase } from './base.js';
import { FlowViewEdge } from './edge.js';
import { FlowViewNode } from './node.js';
import { FlowViewPin } from './pin.js';
import { FlowViewSelector } from './selector.js';
import { cssClass, cssTheme, cssVar } from './theme.js';

/**
 * @typedef {import('./flow-view.js').FlowView} FlowView
 * @typedef {import('./types').FlowViewChangeInfo} FlowViewChangeInfo
 * @typedef {import('./types').FlowViewEdgeObj} FlowViewEdgeObj
 * @typedef {import('./types').FlowViewSemiEdge} FlowViewSemiEdge
 * @typedef {import('./types').FlowViewNodeObj} FlowViewNodeObj
 * @typedef {import('./types').Vector} Vector
 */

/**
 * @param {MouseEvent} event
 * @returns {Vector}
 */
const pointerCoordinates = ({ clientX, clientY, target }) => {
	if (!(target instanceof Element)) throw new TypeError('Invalid event target');
	const { left, top } = target.getBoundingClientRect();
	return { x: Math.round(clientX - left), y: Math.round(clientY - top) };
}

export class FlowViewElement extends HTMLElement {
	static defaultItems = {
		node: FlowViewNode
	}

	static style = {
		':host([hidden])': { display: 'none' },
		':host': {
			position: 'relative',
			display: 'block',
			overflow: 'hidden',
			border: 0,
			margin: 0,
			outline: 0,
			'background-color': cssVar.backgroundColor,
			'border-radius': cssVar.borderRadius,
			'font-family': cssVar.fontFamily,
			'font-size': cssVar.fontSize,
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
					Object.entries(rules)
						.map(([key, value]) => `${key}:${value};`)
						.join(''),
					'}'
				].join(''),
			''
		)
	}

	/** @type {FlowView | undefined} */
	host

	constructor() {
		super()

		const template = document.createElement('template')

		const hasLight = this.hasAttribute('light')
		const hasDark = this.hasAttribute('dark')
		const isLight = hasLight && !hasDark
		const isDark = !hasLight && hasDark

		const { generateStylesheet } = FlowViewElement
		const lightStyle = generateStylesheet({ ':host': cssTheme('light') })
		const darkStyle = generateStylesheet({ ':host': cssTheme('dark') })

		template.innerHTML = [
			'<style>',
			generateStylesheet(FlowViewElement.style),
			generateStylesheet({
				':host': {
					'color-scheme': isLight ? 'light' : isDark ? 'dark' : 'light dark'
				}
			}),
			...(isLight
				? lightStyle
				: isDark
				? darkStyle
				: [lightStyle, `@media(prefers-color-scheme:dark){${darkStyle}}`]),
			'</style>'
		].join('')

		this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

		this._origin = { x: 0, y: 0 }

		this.nodesMap = new Map()
		this.edgesMap = new Map()

		this.itemClassMap = new Map()
		Object.entries(FlowViewElement.defaultItems).forEach(([key, Class]) => {
			this.itemClassMap.set(key, Class)
		})

		this.selectorId = `selector-${FlowViewBase.generateId(this)}`
	}

	connectedCallback() {
		if ('ResizeObserver' in window) {
			this.rootResizeObserver = new ResizeObserver(this.onRootResize.bind(this))
			// @ts-ignore
			this.rootResizeObserver.observe(this.parentNode)
		} else {
			this.height = 200
		}

		if (!this.getAttribute('tabindex')) this.setAttribute('tabindex', '0')

		this.addEventListener('dblclick', this);
		this.addEventListener('keydown', this);
		this.addEventListener('pointerdown', this);
		this.addEventListener('pointermove', this);
		this.addEventListener('pointerleave', this);
		this.addEventListener('pointerup', this);
		this.addEventListener('touchmove', this, { passive: false });
	}

	disconnectedCallback() {
		this.removeResizeObserver();
		this.removeEventListener('dblclick', this);
		this.removeEventListener('keydown', this);
		this.removeEventListener('pointerdown', this);
		this.removeEventListener('pointermove', this);
		this.removeEventListener('pointerleave', this);
		this.removeEventListener('pointerup', this);
		this.removeEventListener('touchmove', this);
	}

	/** @param {Event | MouseEvent} event */
	handleEvent(event) {
		if (event instanceof KeyboardEvent && event.type === 'keydown') {
			event.stopPropagation();

			if (!this.selector) {
				switch (event.code) {
					case 'Backspace': this.deleteSelectedItems();
						break;
					case 'Escape': this.clearSelection();
						break;
					default: break;
				}
			}
		}
		if (event.type === 'touchmove') {
			event.preventDefault();
			event.stopPropagation();
		}
		if (event instanceof MouseEvent && event.type === 'dblclick') {
			this.clearSelection();
			this.removeSelector();
			const { x, y } = pointerCoordinates(event);
			this.createSelector({
				position: { x: x + this.origin.x, y: y + this.origin.y }
			}).focus();
		}
		if (event instanceof MouseEvent && event.type === 'pointerdown') {
			event.stopPropagation();
			this.removeSelector();
			// @ts-ignore
			if (!event.isBubblingFromNode) this.clearSelection()
			const isMultiSelection = event.shiftKey
			if (!isMultiSelection) this.startTranslation(event)
		}
		if (event.type === 'pointerleave' || event.type === 'pointerup') {
			this.stopTranslation();
			this.removeSemiEdge();
		}
		if (event instanceof MouseEvent && event.type === 'pointermove') {
			const { hasSelectedNodes, semiEdge, startDraggingPoint } = this;

			if (startDraggingPoint) {
				const pointerPosition = pointerCoordinates(event)
				const x = startDraggingPoint.x - pointerPosition.x
				const y = startDraggingPoint.y - pointerPosition.y

				switch (true) {
					case !!semiEdge: {
						semiEdge.end = {
							x: pointerPosition.x + this.origin.x,
							y: pointerPosition.y + this.origin.y
						}
						semiEdge.updateGeometry()
						break
					}

					case hasSelectedNodes: {
						this.translateVector = { x, y }
						const { edges, selectedNodes, selectedNodeIds, selectedNodesStartPosition } = this

						for (const node of selectedNodes) {
							// @ts-ignore
							const { x: startX, y: startY } = selectedNodesStartPosition[node.id]
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
	}

	removeResizeObserver() {
		// @ts-ignore
		if (this.parentNode) this.rootResizeObserver?.unobserve(this.parentNode)
		delete this.rootResizeObserver
	}

	get origin() {
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

	/** @param {FlowViewChangeInfo} viewChangeInfo */
	clear(viewChangeInfo) {
		this.nodes.forEach((node) => {
			this.deleteNode(node.id, viewChangeInfo)
		})
	}

	/**
	 * @param {FlowViewEdgeObj} edge
	 * @param {FlowViewChangeInfo} viewChangeInfo
	 */
	newEdge({ id, from: [sourceNodeId, sourcePinId], to: [targetNodeId, targetPinId] }, viewChangeInfo) {
		const sourceNode = this.node(sourceNodeId)
		const targetNode = this.node(targetNodeId)
		const source = sourceNode.output(sourcePinId)
		const target = targetNode.input(targetPinId)
		const edge = new FlowViewEdge({
			id: id || FlowViewBase.generateId(this),
			view: this,
			source,
			target
		})
		edge.updateGeometry()
		this.edgesMap.set(edge.id, edge)
		// @ts-ignore
		this.host.viewChange({ createdEdge: edge.toObject() }, viewChangeInfo)
		return edge
	}

	/**
	 * @param {FlowViewNodeObj} node
	 * @param {FlowViewChangeInfo} viewChangeInfo
	 */
	newNode({ x = 0, y = 0, text, id, ins = [], outs = [] }, viewChangeInfo) {
		const { host } = this;
		if (!host) return;
		const nodeType = host.nodeTextToType?.(text) ?? '';
		const nodeSignature = host.nodeTypeSignature.get(nodeType);
		const inputs =
			nodeSignature?.ins?.map((item, i) => ({
				...item,
				...(ins[i] ?? {})
			})) ?? ins;
		const outputs =
			nodeSignature?.outs?.map((item, i) => ({
				...item,
				...(outs[i] ?? {})
			})) ?? outs;
		const Class = this.itemClassMap.get(nodeType) ?? this.itemClassMap.get('node');
		const node = new Class({
			id,
			view: this,
			cssClassName: cssClass.node,
			text,
			x,
			y,
			type: nodeType
		});
		node.initContent({ text, inputs, outputs });
		for (const pin of inputs) node.newInput(pin)
		for (const pin of outputs) node.newOutput(pin)
		this.nodesMap.set(node.id, node);
		const createdNode = nodeType ? { ...node.toObject(), type: nodeType } : node.toObject();
		// @ts-ignore
		this.host.viewChange({ createdNode }, viewChangeInfo);
		return node;
	}

	/** @param {FlowViewEdge} edge */
	selectEdge(edge) {
		edge.highlight = true
		edge.isSelected = true
		// @ts-ignore
		edge.source.highlight = true
		// @ts-ignore
		edge.target.highlight = true
	}

	/** @param {FlowViewNode} node */
	selectNode(node) {
		node.highlight = true
		node.isSelected = true
		for (const edge of this.edges) {
			if (edge.source.node.isSelected && edge.target.node.isSelected) {
				this.selectEdge(edge)
			} else {
				this.deselectEdge(edge)
			}
		}
	}

	/** @param {FlowViewEdge} edge */
	deselectEdge(edge) {
		edge.highlight = false
		edge.isSelected = false
		const { source, target } = edge
		if (source && source.node?.isSelected === false)
			source.highlight = false;
		if (target && target.node?.isSelected === false)
			target.highlight = false;
	}

	/** @param {FlowViewNode} node */
	deselectNode(node) {
		node.highlight = false
		node.isSelected = false
		for (const input of node.inputs) input.highlight = false
		for (const output of node.outputs) output.highlight = false
	}

	/**
	 * @param {string} id
	 * @param {FlowViewChangeInfo} viewChangeInfo
	 */
	deleteEdge(id, viewChangeInfo) {
		const edge = this.edgesMap.get(id)
		if (!edge) return

		edge.source.highlight = false
		edge.target.highlight = false

		// Dispose.
		this.edgesMap.delete(edge.id);
		edge.dispose();
		edge.element.remove();

		const serializedEdge = edge.toObject()
		// @ts-ignore
		this.host.viewChange({ deletedEdge: serializedEdge }, viewChangeInfo)
		return serializedEdge
	}

	/**
	 * @param {string} id
	 * @param {FlowViewChangeInfo} viewChangeInfo
	 */
	deleteNode(id, viewChangeInfo) {
		const node = this.nodesMap.get(id)
		if (!node) return

		// Remove edges connected to node.
		for (const edge of this.edges) {
			if (edge.source.node.id === node.id || edge.target.node.id === node.id) {
				this.deleteEdge(edge.id, viewChangeInfo)
			}
		}

		// Dispose.
		this.nodesMap.delete(node.id)
		node.dispose();
		node.element.remove();

		const serializedNode = node.toObject()
		// @ts-ignore
		this.host.viewChange({ deletedNode: serializedNode }, viewChangeInfo)
		return serializedNode
	}

	/**
	 * @param {string} id
	 * @returns {FlowViewEdge}
	 */
	edge(id) {
		if (!this.edgesMap.has(id))
			throw new Error(`flow-view edge not found id=${id}`)
		return this.edgesMap.get(id)
	}

	/**
	 * @param {string} id
	 * @returns {FlowViewNode}
	 */
	node(id) {
		if (!this.nodesMap.has(id))
			throw new Error(`flow-view node not found id=${id}`)
		return this.nodesMap.get(id)
	}

	/** @param {MouseEvent} event */
	startTranslation(event) {
		this.startDraggingPoint = pointerCoordinates(event)
		this.translateVector = { x: 0, y: 0 }
		if (this.hasSelectedNodes) {
			const selectedNodesStartPosition = {}
			// @ts-ignore
			for (const node of this.selectedNodes) selectedNodesStartPosition[node.id] = node.position
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

	/**
	 * @param {{ position: { x: number, y: number } }} pointer
	 */
	createSelector({ position }) {
		return (this.selector = new FlowViewSelector({
			element: this.#createElement('div', cssClass.selector),
			view: this,
			// @ts-ignore
			position,
			nodeList: Array.from(this.host?.nodeList ?? [])
		}))
	}

	/** @param {{ node: FlowViewNode }} arg */
	updateNode({ node }) {
		// @ts-ignore
		this.host.viewChange({ updatedNode: node.toObject() }, viewChangeInfo)
	}

	// @ts-ignore
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

	/**
	 * @param {FlowViewSemiEdge} arg
	 */
	createSemiEdge({ source, target }) {
		this.semiEdge = new FlowViewEdge({
			id: 'semiEdge',
			view: this,
			source,
			target
		})
		this.host?.viewChange(
	// @ts-ignore
			{ createdSemiEdge: { from: source instanceof FlowViewPin ? [source.node.id, source.id] : undefined, to: target instanceof FlowViewPin ? [target.node.id, target.id] : undefined }
			}
		)
	}

	clearSelection() {
		for (const node of this.selectedNodes) this.deselectNode(node)
		for (const edge of this.selectedEdges) this.deselectEdge(edge)
	}

	deleteSelectedItems() {
		for (const edge of this.selectedEdges) this.deleteEdge(edge.id, {})
		for (const node of this.selectedNodes) this.deleteNode(node.id, {})
	}

	removeSemiEdge() {
		if (!this.semiEdge) return
		const { source, target } = this.semiEdge
		this.semiEdge.dispose()
		this.semiEdge.element.remove()
		delete this.semiEdge
		// @ts-ignore
		this.host.viewChange(
		// @ts-ignore
			{ deletedSemiEdge: { from: source instanceof FlowViewPin ? [source.node.id, source.id] : undefined, to: target instanceof FlowViewPin ? [target.node.id, target.id] : undefined
				}
			}
		)
	}

	removeSelector() {
		this.selector?.dispose();
		this.selector?.element.remove();
		this.selector = undefined
	}

	/**
	 * @param {string} tag
	 * @param {string} cssClass
	 */
	#createElement(tag, cssClass) {
		const element = document.createElement(tag);
		element.classList.add(cssClass);
		this.shadowRoot?.appendChild(element);
		return element;
	}
}
