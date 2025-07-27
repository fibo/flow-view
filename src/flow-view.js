import { Connection, Container } from './common.js';
import { Link } from './link.js';
import { Node } from './node.js';
import { Input } from './input.js';
import { Output } from './output.js';
import { Prompt } from './prompt.js';
import { cssTheme, cssClass, cssPin, flowViewStyle, linkStyle, nodeStyle, pinStyle, selectorStyle, generateStyle } from './theme.js';

/**
 * @typedef {import('./types').FlowViewPinPath} FlowViewPinPath
 * @typedef {import('./types').FlowViewGraph} FlowViewGraph
 * @typedef {import('./types').FlowViewNodeSignature} FlowViewNodeSignature
 * @typedef {import('./types').Vector} Vector
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

const { size: pinSize, halfSize: halfPinSize } = cssPin

class SemiLink {
	container = new Container(cssClass.link);
	connection = new Connection();
	/** @param {Vector} position */
	constructor(position) {
		this.start = position;
		this.end = position;
		this.container.element.append(this.connection.container);
	}
	dispose() {
		this.container.element.remove();
	}
}

const eventTypes = [
	'dblclick', 'keydown', 'keyup', 'pointerdown', 'pointerenter', 'pointermove', 'pointerleave', 'pointerup', 'touchmove', 'wheel'
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

	/** @type {SemiLink | undefined} */
	#semiLink

	#ids = new Set();

	get #parent() { return /** @type {Element} */ (this.parentNode) }
	#resizeObserver = new ResizeObserver((entries) => {
		for (const entry of entries) {
			if (this.#parent !== entry.target) continue;
			this.width = Math.floor(entry.contentRect.width);
			this.height = Math.floor(entry.contentRect.height);
		}
	});

	#origin = { x: 0, y: 0 };

	#isGrabbing = false;
	/** @type {Vector | undefined } */
	#grabbingVector;

	/** @type {Map<string, Node>} */
    #nodes = new Map();
	/** @type {Map<string, Link>} */
	#links = new Map();

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
				...linkStyle,
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
			if (event.code === 'Space') {
				event.preventDefault();
				this.style.cursor = 'grabbing';
				this.#isGrabbing = true;
			}
			if (event.code === 'Backspace') {
				this.#deleteSelectedItems();
			}
			if (event.code === 'Escape') {
				this.#clearSelection();
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
			if (this.#isGrabbing)
				this.#grabbingVector = pointerCoordinates(event);
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
			this.#removeSemiLink();
			this.#grabbingVector = undefined;
		}
		if (event instanceof MouseEvent && event.type === 'pointermove') {
			const pointerPosition = pointerCoordinates(event)
			if (this.#isGrabbing && this.#grabbingVector) {
				this.#origin.x += this.#grabbingVector.x - pointerPosition.x;
				this.#origin.y += this.#grabbingVector.y - pointerPosition.y;
				this.#updateNodesAndLinksGeometry();
				this.#grabbingVector = pointerPosition;
			}

			if (this.#semiLink) {
				if (this.pendingPin instanceof Output)
					this.#semiLink.end = {
						x: pointerPosition.x + this.#origin.x,
						y: pointerPosition.y + this.#origin.y
					};
				if (this.pendingPin instanceof Input)
					this.#semiLink.start = {
						x: pointerPosition.x + this.#origin.x,
						y: pointerPosition.y + this.#origin.y
					};
				this.#updateLinkGeometry(this.#semiLink)
			}
		}
		if (event instanceof WheelEvent && event.type === 'wheel') {
			event.preventDefault();
			event.stopPropagation();
			this.#origin.x += event.deltaX;
			this.#origin.y += event.deltaY;
			this.#updateNodesAndLinksGeometry();
		}
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
			this.#deleteNode(id);
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
		const link = new Link(source, target, {
			delete: () => this.#deleteLink(id),
			select: () => this.#selectLink(link),
		});
		this.#root.append(link.container.element)
		this.#links.set(id, link)
		this.#updateLinkGeometry(link);
		return link
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
		const node = new Node({
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
		this.#updateNodeGeometry(node);
		node.contentDiv.textContent = node.text
		this.#nodes.set(id, node);
		return node;
	}

	/**
	 * @param {string} id
	 * @returns {Link | undefined}
	 */
	link(id) { return this.#links.get(id) }

	/**
	 * @param {string} id
	 * @returns {Node | undefined}
	 */
	node(id) { return this.#nodes.get(id) }

	/**
	 * @param {Input | Output} pin
	 */
	createSemiLink(pin) {
		this.pendingPin = pin;
		this.#semiLink = new SemiLink(pin.center);
		this.#root.append(this.#semiLink.container.element);
	}

	/**
	 * @param {{
	 *   container: Container
	 *   connection: Connection
	 *   start: Vector
	 *   end: Vector
	 * }} link
	 */
	#updateLinkGeometry({ container, connection, start, end }) {
		const { element }  = container;
		const { x: startX, y: startY } = start;
		const { x: endX, y: endY } = end;

		const invertedX = endX < startX
		const invertedY = endY < startY

		const top = (invertedY ? endY - halfPinSize : startY - halfPinSize) - this.#origin.y
		const left = (invertedX ? endX - halfPinSize : startX - halfPinSize) - this.#origin.x
		element.style.top = `${top}px`
		element.style.left = `${left}px`

		const width = invertedX ? startX - endX + pinSize : endX - startX + pinSize;
		element.style.width = `${width}px`
		connection.width = width;

		const height = invertedY ? startY - endY + pinSize : endY - startY + pinSize;
		element.style.height = `${height}px`
		connection.height = height;

		connection.start = {
			x: invertedX ? width - halfPinSize : halfPinSize,
			y: invertedY ? height - halfPinSize : halfPinSize
		};
		connection.end = {
			x: invertedX ? halfPinSize : width - halfPinSize,
			y: invertedY ? halfPinSize : height - halfPinSize
		};
	}

	/** @param {Node} node */
	#updateNodeGeometry(node) {
		node.container.element.style.top = `${node.position.y - this.#origin.y}px`
		node.container.element.style.left = `${node.position.x - this.#origin.x}px`
	}

	#updateNodesAndLinksGeometry() {
		for (const node of this.#nodes.values())
			this.#updateNodeGeometry(node);
		for (const link of this.#links.values())
			this.#updateLinkGeometry(link);
	}

	#deleteSelectedItems() {
		for (const [id, node] of this.#nodes.entries())
			if (node.isSelected)
				this.#deleteNode(id);
		for (const [id, link] of this.#links.entries())
			if (link.isSelected)
				this.#deleteLink(id);
	}

	/**
	 * @param {string} id
	 */
	#deleteLink(id) {
		const edge = this.#links.get(id)
		if (!edge) return

		edge.source.container.highlight = false
		edge.target.container.highlight = false

		// Dispose.
		this.#links.delete(id);
		this.#ids.delete(id);
		edge.dispose();
	}

	/**
	 * @param {string} id
	 */
	#deleteNode(id) {
		const node = this.#nodes.get(id)
		if (!node) return
		// Remove links connected to node.
		for (const [edgeId, edge] of this.#links.entries())
			if (edge.source.node.id === id || edge.target.node.id === id)
				this.#deleteLink(edgeId);
		// Dispose.
		this.#nodes.delete(id)
		this.#ids.delete(id);
		node.dispose();
	}

	/** @param {Link} link */
	// #deselectLink(link) {
	// 	link.container.highlight = false
	// 	link.isSelected = false
	// 	const { source, target } = link
	// 	if (source && source.node?.isSelected === false)
	// 		source.container.highlight = false;
	// 	if (target && target.node?.isSelected === false)
	// 		target.container.highlight = false;
	// }

	/**
	 * @param {Link} link
	 * @param {boolean=} isMultiSelection
	 */
	#selectLink(link, isMultiSelection) {
		if (!isMultiSelection) this.#clearSelection()
		link.container.highlight = true
		link.isSelected = true
		link.source.container.highlight = true
		link.target.container.highlight = true
	}

	/**
	 * @param {Node} node
	 */
	// #selectNode(node) {
	// 	node.container.highlight = true
	// 	node.isSelected = true
	// }

	/** @param {Node} node */
	// #deselectNode(node) {
	// 	node.container.highlight = false
	// 	node.isSelected = false
	// 	for (const input of node.inputs)
	// 		input.container.highlight = false;
	// 	for (const output of node.outputs)
	// 		output.container.highlight = false;
	// }

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

	#clearSelection() {
		// TODO
		// for (const node of this.#selectedNodes)
		// 	this.#deselectNode(node)
		// for (const edge of this.#links.values())
		// 	this.#deselectLink(edge);
	}

	#removePrompt() {
		this.prompt?.dispose();
		delete this.prompt
	}

	#removeSemiLink() {
		this.#semiLink?.dispose()
		this.#semiLink = undefined
	}

	/** @param {FlowViewGraph} graph */
	load({ nodes, links = [] }) {
		for (const [id, node] of Object.entries(nodes))
			this.newNode(node, id);
		for (const { from, to } of links)
			this.newLink(from, to);
	}
}
