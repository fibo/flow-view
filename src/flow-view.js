import { Connection, Container } from './common.js';
import { Link } from './link.js';
import { Node } from './node.js';
import { Input } from './input.js';
import { Output } from './output.js';
import { Prompt } from './prompt.js';
import { cssTheme, cssClass, cssPin, flowViewStyle, linkStyle, nodeStyle, pinStyle, selectorStyle, generateStyle } from './style.js';

/**
 * @typedef {import('./types').FlowViewPinPath} FlowViewPinPath
 * @typedef {import('./types').FlowViewGraph} FlowViewGraph
 * @typedef {import('./types').FlowViewNodeSignature} FlowViewNodeSignature
 * @typedef {import('./types').Vector} Vector
 */

const lightStyle = generateStyle({ ':host': cssTheme.light });
const darkStyle = generateStyle({ ':host': cssTheme.dark });

const { size: pinSize, halfSize: halfPinSize } = cssPin

class SemiLink {
	container = new Container(cssClass.link);
	connection = new Connection();
	/**
	 * @param {Input | Output} pin
	 * @param {Vector} position
	 */
	constructor(pin, position) {
		this.start = position;
		this.end = position;
		this.pin = pin;
		if (pin instanceof Input)
			this.end = pin.center;
		if (pin instanceof Output)
			this.start = pin.center;
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
			this.style.width = `${Math.floor(entry.contentRect.width)}px`;
			this.style.height = `${Math.floor(entry.contentRect.height)}px`;
		}
	});

	#origin = { x: 0, y: 0 };

	#isGrabbing = false;
	/** @type {Vector | undefined } */
	#grabbingVector;

	/** @type {Vector | undefined } */
	#pointerVector;

	/** @type {Map<string, Node>} */
    #nodes = new Map();
	/** @type {Map<string, Link>} */
	#links = new Map();

	static defineElement() {
		if (!customElements.get('flow-view'))
			customElements.define('flow-view', FlowView);
	}

	/**
	 * @param {Element} element
	 * @returns {FlowView}
	 */
	static instance(element) {
		FlowView.defineElement();
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
		if (event instanceof KeyboardEvent) {
			event.stopPropagation();
			if (event.type === 'keydown') {
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
			if (event.type === 'keyup') {
				if (event.code === 'Space') {
					this.style.cursor = 'default';
					this.#isGrabbing = false;
				}
			}
		}

		if (event.type === 'touchmove') {
			event.preventDefault();
			event.stopPropagation();
		}

		if (event instanceof MouseEvent && event.type === 'dblclick') {
			this.#clearSelection();
			this.#removePrompt();
			const { x, y } = this.#pointerCoordinates(event);
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

		if (event.type === 'pointerenter') {
			window.addEventListener('keydown', this);
			window.addEventListener('keyup', this);
		}
		if (event.type === 'pointerleave') {
			window.removeEventListener('keydown', this);
			window.removeEventListener('keyup', this);
		}
		if (event.type === 'pointerleave') {
			this.#removeSemiLink();
			this.#grabbingVector = undefined;
		}

		if (event instanceof WheelEvent && event.type === 'wheel') {
			event.preventDefault();
			event.stopPropagation();
			this.#origin.x += event.deltaX;
			this.#origin.y += event.deltaY;
			this.#updateNodesAndLinksGeometry();
		}

		if (event instanceof PointerEvent) {
			const { x, y } = this.#pointerCoordinates(event);

			if (event.type === 'pointerdown') {
				event.stopPropagation();
				this.#removePrompt();
				this.#pointerVector = { x, y };
				if (this.#isGrabbing) {
					this.#grabbingVector = { x, y };
				} else {
					const node = this.#getNodeAtPosition({ x, y });
					if (node) {
						const pin = this.#getClosestPin([...node.inputs, ...node.outputs], { x, y });
						if (pin) {
							if (this.#semiLink) {
								const pendingPin = this.#semiLink.pin;
								if (pendingPin.node !== node) { // Avoid loops.
									if (pendingPin instanceof Input && pin instanceof Output) {
										this.newLink([pin.node.id, pin.index], [pendingPin.node.id, pendingPin.index]);
									}
									if(pendingPin instanceof Output && pin instanceof Input) {
										const linkId = [pin.node.id, pin.index].join();
										const link = this.#links.get(linkId);
										if (link) this.#deleteLink(linkId);
										this.newLink([pendingPin.node.id, pendingPin.index], [pin.node.id, pin.index]);
									}
								}
								this.#removeSemiLink();
							} else {
								if (pin instanceof Output) {
									this.#createSemiLink(pin, { x, y });
								} else {
									const linkId = [pin.node.id, pin.index].join();
									const link = this.#links.get(linkId);
									// If Input is already connected, create a semi link.
									if (link) {
										const semiLink = this.#createSemiLink(link.source, { x, y });
										this.#updateLinkGeometry(semiLink)
										this.#deleteLink(linkId);
									} else {
										this.#createSemiLink(pin, { x, y });
									}
								}
							}
						} else {
							this.#clearSelection()
							this.#selectNode(node);
						}
					} else {
						this.#clearSelection();
						this.#removeSemiLink();
					}
				}
			}

			if (event.type === 'pointermove') {
				if (this.#isGrabbing && this.#grabbingVector) {
					this.#origin.x += this.#grabbingVector.x - x;
					this.#origin.y += this.#grabbingVector.y - y;
					this.#updateNodesAndLinksGeometry();
					this.#grabbingVector = { x, y };
				} else if (this.#semiLink) {
					if (this.#semiLink.pin instanceof Output)
						this.#semiLink.end = {
							x: x + this.#origin.x,
							y: y + this.#origin.y
						};
					if (this.#semiLink.pin instanceof Input)
						this.#semiLink.start = {
							x: x + this.#origin.x,
							y: y + this.#origin.y
						};
					this.#updateLinkGeometry(this.#semiLink)
				} else if (this.#pointerVector) {
					/** @type {string[]} */
					const selecteNodeIds = [];
					for (const node of this.#nodes.values()) {
						if (node.isSelected) {
							selecteNodeIds.push(node.id);
							node.position = {
								x: node.position.x + x - this.#pointerVector.x,
								y: node.position.y + y - this.#pointerVector.y
							};
							this.#updateNodeGeometry(node);
						}
					}
					for (const link of this.#links.values()) {
						if (selecteNodeIds.includes(link.source.node.id) ||
							selecteNodeIds.includes(link.target.node.id)) {
							this.#updateLinkGeometry(link);
						}
					}
					this.#pointerVector = { x, y };
				}
			}

			if (event.type === 'pointerup') {
				this.#pointerVector = undefined;
			}
		}
	}

	get height() { return parseInt(this.style.height) }
	get width() { return parseInt(this.style.width) }

	clear() {
		for (const id of this.#nodes.keys())
			this.#deleteNode(id);
	}

	/** @param {FlowViewGraph} graph */
	load({ nodes, links = [] }) {
		for (const [id, node] of Object.entries(nodes))
			this.newNode(node, id);
		for (const { from, to } of links)
			this.newLink(from, to);
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
		// An Input can be connected only to one Link.
		const id = [targetNodeId, targetPosition].join();
		if (this.#links.has(id)) throw new Error('Input already connected');
		const link = new Link(source, target, {
			delete: () => this.#deleteLink(id),
			select: () => this.#selectLink(link),
		});
		this.#root.append(link.container.element)
		link.container.element.setAttribute('id', id);
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

	/** @param {MouseEvent} event */
	#pointerCoordinates({ clientX, clientY }) {
		const { x, y } = this.getBoundingClientRect();
		return { x: Math.round(clientX - x), y: Math.round(clientY - y) }
	}

	/**
	 * @param {Input | Output} pin
	 * @param {Vector} position
	 * @returns {SemiLink}
	 */
	#createSemiLink(pin, position) {
		const semiLink = new SemiLink(pin, position);
		this.#root.append(semiLink.container.element);
		return (this.#semiLink = semiLink);
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
	#deselectLink(link) {
		link.container.highlight = false
		link.isSelected = false
		const { source, target } = link
			source.container.highlight = false;
			target.container.highlight = false;
	}

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
	#selectNode(node) {
		node.container.highlight = true
		node.isSelected = true
	}

	/** @param {Node} node */
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

	#clearSelection() {
		for (const node of this.#nodes.values())
			this.#deselectNode(node)
		for (const edge of this.#links.values())
			this.#deselectLink(edge);
	}

	#removePrompt() {
		this.prompt?.dispose();
		delete this.prompt
	}

	#removeSemiLink() {
		this.#semiLink?.dispose()
		this.#semiLink = undefined
	}

	/** @param {Vector} position */
	#getNodeAtPosition({ x, y }) {
		for (const node of this.#nodes.values()) {
			const { width, height } = node.container.element.getBoundingClientRect();
			if (x < node.position.x || x > node.position.x + width)
				continue;
			if (y < node.position.y || y > node.position.y + height)
				continue;
			return node;
		}
	}

	/**
	 * @param {Array<Input | Output>} pins
	 * @param {Vector} position
	 */
	#getClosestPin(pins, { x, y }) {
		return pins.find(({ center }) => (
			(x >= center.x - pinSize && x <= center.x + pinSize) &&
			(y >= center.y - pinSize && y <= center.y + pinSize)
		))
	}
}
