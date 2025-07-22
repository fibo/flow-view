import { FlowViewEdge } from './edge.js';
import { FlowViewNode } from './node.js';
import { FlowViewPin } from './pin.js';
import { FlowViewSelector } from './selector.js';
import { cssClass, cssTheme, flowViewStyle, edgeStyle, nodeStyle, pinStyle, selectorStyle, generateStyle } from './theme.js';

/**
 * @typedef {import('./flow-view.js').FlowView} FlowView
 * @typedef {import('./types').FlowViewChangeInfo} FlowViewChangeInfo
 * @typedef {import('./types').FlowViewEdgeObj} FlowViewEdgeObj
 * @typedef {import('./types').FlowViewSemiEdge} FlowViewSemiEdge
 * @typedef {import('./types').FlowViewNodeObj} FlowViewNodeObj
 * @typedef {import('./types').Vector} Vector
 */

const lightStyle = generateStyle({ ':host': cssTheme('light') });
const darkStyle = generateStyle({ ':host': cssTheme('dark') });

/**
 * @param {MouseEvent} event
 * @returns {Vector}
 */
const pointerCoordinates = ({ clientX, clientY, target }) => {
	if (!(target instanceof Element)) throw new Error();
	const { left, top } = target.getBoundingClientRect();
	return { x: Math.round(clientX - left), y: Math.round(clientY - top) }
}

const eventTypes = [
	'dblclick', 'keydown', 'pointerdown', 'pointermove', 'pointerleave', 'pointerup', 'touchmove'
];

export class FlowViewElement extends HTMLElement {
	/** @type {FlowView | undefined} */
	host;
	/** @type {Vector} */
	#origin = { x: 0, y: 0 };
	/** @type {Vector} */
	#translation = { x: 0, y: 0 };

	constructor() {
		super();

		const template = document.createElement('template');

		const hasLight = this.hasAttribute('light')
		const hasDark = this.hasAttribute('dark')
		const isLight = hasLight && !hasDark
		const isDark = !hasLight && hasDark

		template.innerHTML = [
			'<style>',
			...(isLight ? lightStyle
				: isDark ? darkStyle
				: [lightStyle, `@media(prefers-color-scheme:dark){${darkStyle}}`]),
			generateStyle({ ':host': {
				'color-scheme': isLight ? 'light' : isDark ? 'dark' : 'light dark'
			}}),
			generateStyle(flowViewStyle),
			generateStyle(edgeStyle),
			generateStyle(nodeStyle),
			generateStyle(pinStyle),
			generateStyle(selectorStyle),
			'</style>'
		].join('\n')

		this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

		this.nodesMap = new Map()
		this.edgesMap = new Map()
	}

	connectedCallback() {
		this.setAttribute('tabindex', '-1'); // Enables keyboard events.
		this.style.isolation = 'isolate';
		eventTypes.forEach((eventType) => this.addEventListener(eventType, this));
		if ('ResizeObserver' in window) {
			if (this.parentNode instanceof Element) {
				this.rootResizeObserver = new ResizeObserver(this.onRootResize.bind(this))
				this.rootResizeObserver.observe(this.parentNode)
			}
		} else this.height = 200;
	}

	disconnectedCallback() {
		eventTypes.forEach((eventType) => this.removeEventListener(eventType, this));
		if (this.parentNode instanceof Element)
			this.rootResizeObserver?.unobserve(this.parentNode);
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event instanceof KeyboardEvent && event.type === 'keydown') {
			event.stopPropagation();

			if (!this.selector) {
				switch (event.code) {
					case 'Backspace': this.deleteSelectedItems();
						break;
					case 'Escape': this.#clearSelection();
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
			this.#clearSelection();
			this.removeSelector();
			const { x, y } = pointerCoordinates(event);
			this.selector = new FlowViewSelector({
				element: this.#createElement('div', cssClass.selector),
				view: this,
				position: { x: x + this.origin.x, y: y + this.origin.y },
				nodeList: Array.from(this.host?.nodeList ?? [])
			});
		}
		if (event instanceof MouseEvent && event.type === 'pointerdown') {
			event.stopPropagation();
			this.removeSelector();
			// @ts-ignore
			if (!event.isBubblingFromNode) this.#clearSelection()
			const isMultiSelection = event.shiftKey
			if (!isMultiSelection) this.startTranslation(event)
		}
		if (event.type === 'pointerleave' || event.type === 'pointerup') {
			this.stopTranslation();
			this.removeSemiEdge();
		}
		if (event instanceof MouseEvent && event.type === 'pointermove') {
			const { semiEdge, startDraggingPoint } = this;

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

					case this.#hasSelectedNodes: {
						this.#translation = { x, y }
						const { edges, selectedNodesStartPosition } = this
						const selectedNodeIds = this.#selectedNodes.map((node) => node.id);

						for (const node of this.#selectedNodes) {
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
						this.#translation = { x, y }
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

	get origin() {
		if (!this.#hasSelectedNodes) return {
			x: this.#origin.x + this.#translation.x,
			y: this.#origin.y + this.#translation.y
		}
		else return this.#origin
	}

	get edges() {
		return [...this.edgesMap.values()]
	}

	get nodes() {
		return [...this.nodesMap.values()]
	}

	/** @param {number} value */
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
	newEdge({ id: wantedId, from: [sourceNodeId, sourcePinId], to: [targetNodeId, targetPinId] }, viewChangeInfo) {
		const sourceNode = this.node(sourceNodeId)
		const targetNode = this.node(targetNodeId)
		const source = sourceNode.output(sourcePinId)
		const target = targetNode.input(targetPinId)
		const id = this.#generateId(wantedId);
		const element = this.#createElement('div', cssClass.edge);
		const edge = new FlowViewEdge({
			id: this.#generateId(id),
			element,
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
	newNode({ x, y, text, id: wantedId, ins = [], outs = [] }, viewChangeInfo) {
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
		const id = this.#generateId(wantedId);
		const element = this.#createElement('div', cssClass.node);
		element.setAttribute('id', id);
		const node = new FlowViewNode({
			x, y,
			id,
			element,
			view: this,
			text,
			type: nodeType
		});
		node.initContent({ text, x, y });
		for (const pin of inputs) node.newInput(pin)
		for (const pin of outputs) node.newOutput(pin)
		this.nodesMap.set(node.id, node);
		const createdNode = nodeType ? { ...node.toObject(), type: nodeType } : node.toObject();
		// @ts-ignore
		this.host.viewChange({ createdNode }, viewChangeInfo);
		return node;
	}

	/**
	 * @param {FlowViewEdge} edge
	 * @param {boolean=} isMultiSelection
	 */
	selectEdge(edge, isMultiSelection) {
		if (!isMultiSelection) this.#clearSelection()
		edge.highlight = true
		edge.isSelected = true
		// @ts-ignore
		edge.source.highlight = true
		// @ts-ignore
		edge.target.highlight = true
	}

	/**
	 * @param {FlowViewNode} node
	 * @param {boolean=} isMultiSelection
	 */
	selectNode(node, isMultiSelection) {
		if (!isMultiSelection) this.#clearSelection()
		node.highlight = true
		node.isSelected = true
		for (const edge of this.edges) {
			if (edge.source.node.isSelected && edge.target.node.isSelected) {
				this.selectEdge(edge, isMultiSelection)
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
		this.#translation = { x: 0, y: 0 }
		if (this.#hasSelectedNodes) {
			const selectedNodesStartPosition = {}
			// @ts-ignore
			for (const node of this.#selectedNodes) selectedNodesStartPosition[node.id] = node.position
			this.selectedNodesStartPosition = selectedNodesStartPosition
		}
	}

	stopTranslation() {
		if (!this.#hasSelectedNodes && !this.semiEdge) {
			this.#origin = {
				x: this.#origin.x + this.#translation.x,
				y: this.#origin.y + this.#translation.y
			}
		}
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

	/** @param {ResizeObserverEntry[]} entries */
	onRootResize(entries) {
		for (const entry of entries) {
			if (this.parentNode !== entry.target) continue;
			this.width = Math.floor(entry.contentRect.width);
			this.height = Math.floor(entry.contentRect.height);
		}
	}

	/**
	 * @param {FlowViewSemiEdge} arg
	 */
	createSemiEdge({ source, target }) {
		this.semiEdge = new FlowViewEdge({
			id: 'semiEdge',
		    element: this.#createElement('div', cssClass.edge),
			view: this,
			source,
			target
		})
	}

	deleteSelectedItems() {
		for (const edge of this.#selectedEdges) this.deleteEdge(edge.id, {})
		for (const node of this.#selectedNodes) this.deleteNode(node.id, {})
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

	/**
	 * @param {(string | undefined)=} wantedId
	 * @returns {string} id
	 */
	#generateId(wantedId) {
		const id = wantedId || Math.random()
			.toString(36)
			.replace(/[^a-z]+/g, "")
			.substring(0, 5)
		if (this.shadowRoot?.getElementById(id)) return this.#generateId()
		else return id
	}

	#clearSelection() {
		for (const node of this.#selectedNodes) this.deselectNode(node)
		for (const edge of this.#selectedEdges) this.deselectEdge(edge)
	}

	get #selectedEdges() {
		return this.edges.filter((edge) => edge.isSelected)
	}

	get #selectedNodes() {
		return this.nodes.filter((node) => node.isSelected)
	}

	get #hasSelectedNodes() {
		return this.#selectedNodes.length > 0
	}
}
