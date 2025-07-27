import { FlowViewEdge } from './edge.js';
import { FlowViewNode } from './node.js';
import { Prompt } from './prompt.js';
import { SemiEdge } from './semiEdge.js';
import { cssTheme, flowViewStyle, edgeStyle, nodeStyle, pinStyle, selectorStyle, generateStyle } from './theme.js';

/**
 * @typedef {import('./input').FlowViewInput} FlowViewInput
 * @typedef {import('./output').FlowViewOutput} FlowViewOutput
 * @typedef {import('./types').FlowViewPinPath} FlowViewPinPath
 * @typedef {import('./types').FlowViewGraph} FlowViewGraph
 * @typedef {import('./types').FlowViewNodeSignature} FlowViewNodeSignature
 */

/**
 * @param {MouseEvent} event
 */
const pointerCoordinates = ({ clientX, clientY, target }) => {
	if (!(target instanceof Element)) throw new Error();
	const { left, top } = target.getBoundingClientRect();
	return { x: Math.round(clientX - left), y: Math.round(clientY - top) }
}

const lightStyle = generateStyle({ ':host': cssTheme.light });
const darkStyle = generateStyle({ ':host': cssTheme.dark });

const eventTypes = [
	'dblclick', 'keydown', 'keyup', 'pointerdown', 'pointerenter', 'pointermove', 'pointerleave', 'pointerup', 'touchmove'
];

export class FlowView extends HTMLElement {
	/** @type {Set<string>} */
	nodeList = new Set()

	/** @type {Map<string, Partial<FlowViewNodeSignature>>} */
	nodeTypeSignature = new Map()

	/** @type {((text: string) => string | undefined)} */
	nodeTextToType = (_) => ''

	/** @type {ShadowRoot} */
	#root;

	get #parent() { return /** @type {Element} */ (this.parentNode) }
	#resizeObserver = new ResizeObserver((entries) => {
		for (const entry of entries) {
			if (this.#parent !== entry.target) continue;
			this.width = Math.floor(entry.contentRect.width);
			this.height = Math.floor(entry.contentRect.height);
		}
	});

	#origin = { x: 0, y: 0 };
	#translation = { x: 0, y: 0 };

	#isGrabbing = false;

	/** @type {Map<string, FlowViewNode>} */
    #nodes = new Map();
	/** @type {Map<string, FlowViewEdge>} */
	#edges = new Map();

	/**
	 * @param {Element} element
	 * @returns {FlowView}
	 */
	static instance(element) {
		if (!customElements.get('flow-view'))
			customElements.define('flow-view', FlowView);
		if (element instanceof FlowView)
			return element;
		if (element instanceof HTMLElement) {
			const view = document.createElement('flow-view')
			element.append(view)
			if (view instanceof FlowView) return view
		}
		throw new Error('Invalid element', { cause: element });
	}

	constructor() {
		super();

		const template = document.createElement('template');

		// TODO try react on attribute change, using adopted stylesheet
		const theme = this.getAttribute('theme');
		const hasLight = theme === 'light'
		const hasDark = theme === 'dark'
		const isLight = hasLight && !hasDark
		const isDark = !hasLight && hasDark

		template.innerHTML = [
			'<style>',
			...(isLight ? [lightStyle]
				: isDark ? [darkStyle]
				: [lightStyle, `@media(prefers-color-scheme:dark) {${darkStyle}}`]),
			generateStyle({ ':host': {
				'color-scheme': isLight ? 'light' : isDark ? 'dark' : 'light dark'
			}}),
			generateStyle({
				...flowViewStyle,
				...edgeStyle,
				...nodeStyle,
				...pinStyle,
				...selectorStyle,
			}),
			'</style>'
		].join('\n')

		this.#root = this.attachShadow({ mode: 'open' });
		this.#root.append(template.content.cloneNode(true));
	}

	connectedCallback() {
		this.setAttribute('tabindex', '-1'); // Enables keyboard events.
		this.style.isolation = 'isolate';
		eventTypes.forEach((eventType) => this.addEventListener(eventType, this));
		this.#resizeObserver.observe(this.#parent);
	}

	disconnectedCallback() {
		eventTypes.forEach((eventType) => this.removeEventListener(eventType, this));
		this.#resizeObserver.unobserve(this.#parent);
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event instanceof KeyboardEvent && event.type === 'keydown') {
			event.stopPropagation();

			if (!this.prompt) {
				switch (event.code) {
					case 'Space':
						event.preventDefault();
						this.style.cursor = 'grabbing';
						this.#isGrabbing = true;
						break;
					case 'Backspace':
						this.deleteSelectedItems();
						break;
					case 'Escape':
						this.#clearSelection();
						break;
					default: break;
				}
			}
		}
		if (event instanceof KeyboardEvent && event.type === 'keyup') {
			event.stopPropagation();
			if (event.code === 'Space') {
				this.style.cursor = 'default';
				this.#isGrabbing = false;
			}
		}
		if (event.type === 'touchmove') {
			event.preventDefault();
			event.stopPropagation();
		}
		if (event instanceof MouseEvent && event.type === 'dblclick') {
			this.#clearSelection();
			this.#removePrompt();
			const { x, y } = pointerCoordinates(event);
			const position = { x: x + this.#origin.x, y: y + this.#origin.y }
			const prompt = this.prompt = new Prompt(
				position,
				{ origin: this.#origin, width: this.width, height: this.height },
				{
					delete: this.#removePrompt.bind(this),
					newNode: (text) => {
						this.newNode({ text, ...position });
					}
				}
			);
			prompt.nodeList = Array.from(this.nodeList);
			this.#root.append(prompt.element);
			prompt.input.focus()
		}
		if (event instanceof PointerEvent && event.type === 'pointerdown') {
			event.stopPropagation();
			this.#removePrompt();
			// @ts-ignore
			if (!event.isBubblingFromNode) this.#clearSelection()
			const isMultiSelection = event.shiftKey
			if (!isMultiSelection) this.startTranslation(event)
		}
		if (event.type === 'pointerenter') {
			window.addEventListener('keydown', this);
			window.addEventListener('keyup', this);
		}
		if (event.type === 'pointerleave') {
			window.removeEventListener('keydown', this);
			window.removeEventListener('keyup', this);
		}
		if (event.type === 'pointerleave' || event.type === 'pointerup') {
			this.#stopTranslation();
			this.#removeSemiEdge();
		}
		if (event instanceof MouseEvent && event.type === 'pointermove') {
			const pointerPosition = pointerCoordinates(event)
			if (this.#isGrabbing) {
			}

			const { semiEdge, startDraggingPoint } = this;

			if (startDraggingPoint) {
				const x = startDraggingPoint.x - pointerPosition.x
				const y = startDraggingPoint.y - pointerPosition.y

				switch (true) {
					case !!semiEdge: {
						semiEdge.end = {
							x: pointerPosition.x + this.#origin.x,
							y: pointerPosition.y + this.#origin.y
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
								selectedNodeIds.includes(edge.source.node.id) || selectedNodeIds.includes(edge.target.node.id)
							) {
								edge.updateGeometry(this.origin)
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
							edge.updateGeometry(this.origin)
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
		return [...this.#edges.values()]
	}

	get nodes() {
		return [...this.#nodes.values()]
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

	clear() {
		for (const id of this.#nodes.keys())
			this.deleteNode(id);
	}

	/**
	 * @param {FlowViewPinPath} from
	 * @param {FlowViewPinPath} to
	 */
	newLink([sourceNodeId, sourcePosition], [targetNodeId, targetPosition]) {
		const sourceNode = this.#nodes.get(sourceNodeId)
		const targetNode = this.#nodes.get(targetNodeId)
		if (!sourceNode || !targetNode) throw new Error('Node not found')
		const source = sourceNode.outputs[sourcePosition]
		const target = targetNode.inputs[targetPosition]
		if (!source || !target) throw new Error('Pin not found')
		const id = this.#generateId();
		const edge = new FlowViewEdge(source, target, {
			delete: () => this.deleteEdge(id),
			select: () => this.selectEdge(edge),
		});
		this.#root.append(edge.container.element)
		edge.updateGeometry(this.origin)
		this.#edges.set(id, edge)
		return edge
	}

	/**
	 * @param {{
	 *   x: number
	 *   y: number
	 *   text: string
	 * }} node
	 * @param {string=} wantedId
	 */
	newNode({ x, y, text }, wantedId) {
		const nodeType = this.nodeTextToType(text) ?? '';
		const signature = this.nodeTypeSignature.get(nodeType) ?? {};
		const id = this.#generateId(wantedId);
		const node = new FlowViewNode({
			id,
			position: { x, y},
			view: this,
			text,
			type: nodeType
		}, {
			inputs: signature.inputs ?? [],
			outputs: signature.outputs ?? []
		});
		this.#root.append(node.container.element);
		node.contentDiv.textContent = node.text
		this.#nodes.set(id, node);
		return node;
	}

	/**
	 * @param {FlowViewEdge} edge
	 * @param {boolean=} isMultiSelection
	 */
	selectEdge(edge, isMultiSelection) {
		if (!isMultiSelection) this.#clearSelection()
		edge.container.highlight = true
		edge.isSelected = true
		edge.source.container.highlight = true
		edge.target.container.highlight = true
	}

	/**
	 * @param {FlowViewNode} node
	 */
	selectNode(node) {
		node.container.highlight = true
		node.isSelected = true
	}

	/**
	 * @param {string} id
	 */
	deleteEdge(id) {
		const edge = this.#edges.get(id)
		if (!edge) return

		edge.source.container.highlight = false
		edge.target.container.highlight = false

		// Dispose.
		this.#edges.delete(id);
		this.#ids.delete(id);
		edge.dispose();
	}

	/**
	 * @param {string} id
	 */
	deleteNode(id) {
		const node = this.#nodes.get(id)
		if (!node) return
		// Remove edges connected to node.
		for (const [edgeId, edge] of this.#edges.entries())
			if (edge.source.node.id === id || edge.target.node.id === id)
				this.deleteEdge(edgeId);
		// Dispose.
		this.#nodes.delete(id)
		this.#ids.delete(id);
		node.dispose();
	}

	/**
	 * @param {string} id
	 * @returns {FlowViewEdge | undefined}
	 */
	edge(id) { return this.#edges.get(id) }

	/**
	 * @param {string} id
	 * @returns {FlowViewNode | undefined}
	 */
	node(id) { return this.#nodes.get(id) }

	/** @param {{ node: FlowViewNode }} arg */
	updateNode({ node }) {
		// @ts-ignore
		this.host.viewChange({ updatedNode: node.toObject() })
	}

	/**
	 * @param {FlowViewOutput | FlowViewInput} pin
	 */
	createSemiEdge(pin) {
		this.pendingPin = pin;
		this.semiEdge = new SemiEdge({ origin: this.origin, position: pin.center });
		this.#root.append(this.semiEdge.container.element);
	}

	deleteSelectedItems() {
		for (const [id, edge] of this.#edges.entries())
			if (edge.isSelected)
				this.deleteEdge(id);
		for (const node of this.#selectedNodes)
			this.deleteNode(node.id)
	}

	#ids = new Set();

	/** @param {FlowViewEdge} edge */
	#deselectEdge(edge) {
		edge.container.highlight = false
		edge.isSelected = false
		const { source, target } = edge
		if (source && source.node?.isSelected === false)
			source.container.highlight = false;
		if (target && target.node?.isSelected === false)
			target.container.highlight = false;
	}

	/** @param {FlowViewNode} node */
	#deselectNode(node) {
		node.container.highlight = false
		node.isSelected = false
		for (const input of node.inputs)
			input.container.highlight = false;
		for (const output of node.outputs)
			output.container.highlight = false;
	}

	/**
	 * @param {(string | undefined)=} wantedId
	 * @returns {string} id
	 */
	#generateId(wantedId) {
		const id = wantedId || Math.random()
			.toString(36)
			.replace(/[^a-z]+/g, "")
			.substring(0, 5);
		if (this.#ids.has(id))
			return this.#generateId();
		else {
			this.#ids.add(id);
			return id;
		}
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

	#stopTranslation() {
		if (!this.#hasSelectedNodes && !this.semiEdge) {
			this.#origin = {
				x: this.#origin.x + this.#translation.x,
				y: this.#origin.y + this.#translation.y
			}
		}
		delete this.startDraggingPoint
		delete this.selectedNodesStartPosition
	}

	get #selectedNodes() {
		return this.nodes.filter((node) => node.isSelected)
	}

	get #hasSelectedNodes() {
		return this.#selectedNodes.length > 0
	}

	#clearSelection() {
		for (const node of this.#selectedNodes)
			this.#deselectNode(node)
		for (const edge of this.#edges.values())
			this.#deselectEdge(edge);
	}

	#removePrompt() {
		this.prompt?.dispose();
		delete this.prompt
	}

	#removeSemiEdge() {
		if (!this.semiEdge) return
		this.semiEdge.dispose()
		this.semiEdge.container.element.remove()
		delete this.semiEdge
	}
	/** @param {FlowViewGraph} graph */
	load({ nodes, links = [] }) {
		for (const [id, node] of Object.entries(nodes))
			this.newNode(node, id);
		for (const { from, to } of links)
			this.newLink(from, to);
	}
}
