import { Container, createHtml, ctrlOrMeta, stop, prevent, vector } from './common.js';
import { Link, SemiLink } from './link.js';
import { Node, Input, Output, defaultNodeBodyCreator } from './node.js';
import { Prompt } from './prompt.js';
import { cssClass, cssTheme, cssPin, flowViewStyle, linkStyle, nodeStyle, pinStyle, promptStyle, selectionGroupStyle, generateStyle } from './style.js';

/**
 * @typedef {import('./flow-view.d.ts').FlowViewChangeEventDetail} FlowViewChangeEventDetail
 * @typedef {import('./flow-view.d.ts').FlowViewCustomElement} FlowViewCustomElement
 * @typedef {import('./flow-view.d.ts').FlowViewGraphLinks} FlowViewGraphLinks
 * @typedef {import('./flow-view.d.ts').FlowViewGraphNodes} FlowViewGraphNodes
 * @typedef {import('./flow-view.d.ts').FlowViewGraphNode} FlowViewGraphNode
 * @typedef {import('./flow-view.d.ts').FlowViewGraph} FlowViewGraph
 * @typedef {import('./flow-view.d.ts').FlowViewNodeSignature} FlowViewNodeSignature
 * @typedef {import('./flow-view.d.ts').FlowViewPinPath} FlowViewPinPath
 * @typedef {import('./flow-view.d.ts').FlowViewStaticMethod} FlowViewStaticMethod
 *
 * @typedef {import('./internals.d.ts').Pin} Pin
 * @typedef {import('./internals.d.ts').Vector} Vector
 */

const lightStyle = generateStyle({ ':host': cssTheme.light });
const darkStyle = generateStyle({ ':host': cssTheme.dark });

const { size: pinSize, halfSize: halfPinSize } = cssPin

const eventTypes = [ 'contextmenu', 'dblclick', 'keydown', 'keyup', 'pointerdown', 'pointerenter', 'pointermove', 'pointerleave', 'pointerup', 'touchmove', 'wheel' ];

const { add, sub, xy } = vector;

/** @implements {FlowViewCustomElement} */
export class FlowView extends HTMLElement {
	/** @type {FlowViewCustomElement['nodeList']} */
	nodeList = new Set();
	/** @type {FlowViewCustomElement['nodeTextToType']} */
	nodeTextToType = () => '';
	/** @type {FlowViewCustomElement['nodeTextToBody']} */
	nodeTextToBody = () => undefined;
	/** @type {FlowViewCustomElement['nodeTypeSignature']} */
	nodeTypeSignature = new Map();

	#ids = new Set();
	/** @type {Prompt | undefined} */
	#prompt;
	/** @type {Node | undefined} */
	#pointedOutNode;
	/** @type {SemiLink | undefined} */
	#semiLink;
	/** @type {Set<string>} */
	#selectedNodeIds = new Set();
	/** @type {Set<string>} */
	#selectedLinkIds = new Set();
	/** @type {Set<string>} */
	#clipboardNodeIds = new Set();
	/** @type {Container | undefined} */
	#selection;
	/** @type {Vector | undefined} */
	#selectionStartPosition;
	#origin = xy(0, 0);
	#isGrabbing = false;
	/** @type {Vector | undefined } */
	#grabbingVector;
	/** @type {Vector | undefined } */
	#pointerVector;
	/** @type {Map<string, Node>} */
    #nodes = new Map();
	/** @type {Map<string, Link>} */
	#links = new Map();


	get #parent() { return /** @type {Element} */ (this.parentNode) }
	#resizeObserver = new ResizeObserver((entries) => {
		for (const entry of entries) {
			if (this.#parent !== entry.target) continue;
			this.style.width = `${Math.floor(entry.contentRect.width)}px`;
			this.style.height = `${Math.floor(entry.contentRect.height)}px`;
		}
	});

	/** @type {FlowViewStaticMethod['instance']} */
	static instance(element) {
		if (element instanceof FlowView)
			return element;
		if (element instanceof Element) {
			const view = document.createElement('flow-view');
			element.append(view);
			return /** @type {FlowView} */ (view)
		}
		throw new Error('Invalid element');
	}

	constructor() {
		super();

		const template = createHtml('template');

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
				...promptStyle,
				...selectionGroupStyle,
			}),
			'</style>'
		].join('\n');

		this.attachShadow({ mode: 'open' }).append(template.content.cloneNode(true));
	}

	connectedCallback() {
		this.setAttribute('tabindex', '-1'); // Enables keyboard events.
		this.style.isolation = 'isolate';
		eventTypes.forEach(eventType => this.addEventListener(eventType, this));
		this.#resizeObserver.observe(this.#parent);
	}

	disconnectedCallback() {
		eventTypes.forEach(eventType => this.removeEventListener(eventType, this));
		this.#resizeObserver.unobserve(this.#parent);
	}

	/** @param {Event} event */
	handleEvent(event) {
		if (event.type === 'contextmenu') {
			stop(event); prevent(event);
		}

		if (event instanceof KeyboardEvent) {
			stop(event);
			const code = event.code;
			if (event.type === 'keydown') {
				if (code.startsWith('Arrow')) {
					prevent(event);
					if (!this.#selectedNodeIds.size) return;
					let x = 0, y = 0;
					const step = ctrlOrMeta(event) ? halfPinSize : pinSize * 4;
					if (code === 'ArrowLeft') x = -step;
					if (code === 'ArrowRight') x = step;
					if (code === 'ArrowUp') y = -step;
					if (code === 'ArrowDown') y = +step;
					this.#moveSelectedNodes({ x, y });
				}
				if (code === 'Backspace')
					this.#deleteSelectedItems();
				if (code === 'Escape') {
					this.#clearSelection();
					this.#removeSemiLink();
				}
				if (code === 'Space') {
					prevent(event);
					this.#startGrabbing();
				}
				if (ctrlOrMeta(event)) {
					if (code === 'KeyA')
						for (const node of this.#nodes.values())
							this.#selectNode(node);
					if (code === 'KeyC')
						this.#copy();
					if (code === 'KeyD') {
						prevent(event);
						this.#copy();
						this.#paste();
					}
					if (code === 'KeyV')
						this.#paste();
				}
			}
			if (event.type === 'keyup') {
				if (code === 'Space') return this.#stopGrabbing();
			}
		}

		if (event.type === 'touchmove') {
			stop(event); prevent(event);
		}

		if (event instanceof MouseEvent && event.type === 'dblclick') {
			if (this.#isGrabbing) return;
			this.#clearSelection();
			this.#newPrompt(this.#pointerCoordinates(event));
		}

		if (event.type === 'pointerenter') {
			window.addEventListener('keydown', this);
			window.addEventListener('keyup', this);
		}

		if (event.type === 'pointerleave') {
			window.removeEventListener('keydown', this);
			window.removeEventListener('keyup', this);

			this.#removeSemiLink();
			this.#pointerVector = undefined;
			this.#removeSelection();
			this.#stopGrabbing();
		}

		if (event instanceof WheelEvent && event.type === 'wheel') {
			stop(event); prevent(event);
			this.#origin = add(this.#origin, xy(event.deltaX, event.deltaY));
			this.#updateNodesAndLinksPosition();
			if (this.#semiLink)
				this.#updateSemiLinkPosition(add(this.#pointerCoordinates(event), this.#origin));
			if (this.#prompt)
				this.#removePrompt();
		}

		if (event instanceof PointerEvent) {
			const pointer = this.#pointerCoordinates(event);

			if (event.type === 'pointerdown') {
				stop(event); prevent(event);
				this.#removePrompt();
				if (this.#isGrabbing) return;
				this.#pointerVector = pointer;

				const node = this.#pointedOutNode;
				if (!node) {
					if (!ctrlOrMeta(event)) this.#clearSelection();
					this.#removeSemiLink();
					this.#newSelection(pointer);
					return;
				}

				const pin = this.#getClosestPin([...node.inputs, ...node.outputs], pointer);
				if (!pin) {
					if (this.#selectedNodeIds.has(node.id)) {
						if (ctrlOrMeta(event)) this.#deselectNode(node);
					} else {
						if (!ctrlOrMeta(event)) this.#clearSelection();
						this.#selectNode(node);
					}
					return;
				}

				if (this.#semiLink) {
					const pendingPin = this.#semiLink.pin;
					if (pendingPin.node !== node) { // Avoid loops.
						if (pendingPin instanceof Input && pin instanceof Output) {
						    const newLink =	this.#newLink([pin.node.id, pin.index], [pendingPin.node.id, pendingPin.index]);
							this.#emitChange({ create: { links: { [newLink.id]: newLink.sourceId } } });
						}
						if (pendingPin instanceof Output && pin instanceof Input) {
							const linkId = [pin.node.id, pin.index].join();
							const link = this.#links.get(linkId);
							/** @type {FlowViewChangeEventDetail} */ const changes = {};
							if (link) {
								changes.delete = { links: { [link.id]: link.sourceId } };
								this.#deleteLink(linkId);
							}
							const newLink = this.#newLink([pendingPin.node.id, pendingPin.index], [pin.node.id, pin.index]);
							if (newLink)
								changes.create = { links: { [newLink.id]: newLink.sourceId } };
							this.#emitChange(changes);
						}
					}
					this.#removeSemiLink();
				} else {
					if (!ctrlOrMeta(event)) this.#clearSelection();
					if (pin instanceof Output)
						this.#newSemiLink(pin, pointer);
					if (pin instanceof Input) {
						const linkId = [pin.node.id, pin.index].join();
						const link = this.#links.get(linkId);
						if (link) {
							this.#updateLinkPosition(this.#newSemiLink(link.source, add(pointer, this.#origin)));
							const change = { links: { [link.id]: link.sourceId } };
							this.#deleteLink(linkId);
							this.#emitChange({ delete: change });
						} else
							this.#newSemiLink(pin, pointer);
					}
				}
			}

			if (event.type === 'pointermove') {
				this.#pointedOutNode = undefined;
				if (this.#isGrabbing) {
					if (!this.#grabbingVector) {
						this.#grabbingVector = pointer;
						return;
					}
					this.#origin = add(this.#origin, sub(this.#grabbingVector, pointer));
					this.#updateNodesAndLinksPosition();
					this.#grabbingVector = pointer;
				}

				if (this.#semiLink) {
					this.#updateSemiLinkPosition(add(pointer, this.#origin));
					return;
				}

				if (this.#selection && this.#selectionStartPosition) {
					const start = this.#selectionStartPosition;
					this.#selection.position = xy(Math.min(start.x, pointer.x), Math.min(start.y, pointer.y));
					this.#selection.setElementPosition();
					this.#selection.dimensions = { width: Math.abs(start.x - pointer.x), height: Math.abs(start.y - pointer.y) };
					this.#selection.setElementDimensions();
					for (const node of this.#nodes.values())
						if (this.#selection.intersects(node.container))
							this.#selectNode(node);
						else
							this.#deselectNode(node);
				} else if (this.#pointerVector) {
					this.#moveSelectedNodes(sub(pointer, this.#pointerVector));
					this.#pointerVector = pointer;
				}
			}

			if (event.type === 'pointerup') {
				this.#pointerVector = undefined;
				this.#removeSelection();
			}
		}
	}

	get graph() {
		return {
			nodes: Object.fromEntries(
				Array.from(this.#nodes.entries()).map(([id, node]) => [id, node.toJSON()])
			),
			links: Object.fromEntries(
				Array.from(this.#links.entries()).map(([id, link]) => [id, link.sourceId])
			)
		}
	}

	/** @type {FlowViewCustomElement['clear']} */
	clear() {
		const graph = this.graph;
		this.#removePrompt();
		this.#removeSemiLink();
		for (const id of this.#links.keys())
			this.#deleteLink(id);
		for (const id of this.#nodes.keys())
			this.#deleteNode(id);
		this.#emitChange({ delete: graph });
	}

	/** @type {FlowViewCustomElement['load']} */
	load({ nodes, links = {} }) {
		/** @type {FlowViewGraphNodes} */ const newNodes = {};
		for (const [id, node] of Object.entries(nodes)) {
			const newNode =	this.#newNode(node, id);
			newNodes[id] = newNode.toJSON();
		}
		/** @type {FlowViewGraphLinks} */ const newLinks = {};
		for (const [target, source] of Object.entries(links)) {
			const from  = source.split(',');
			const to = target.split(',');
			const newLink = this.#newLink([from[0], +from[1]], [to[0], +to[1]]);
			newLinks[newLink.id] = newLink.sourceId;
		}
		this.#emitChange({ create: { nodes: newNodes, links: newLinks } } );
	}

	/** @type {FlowViewCustomElement['onChange']} */
	onChange(callback) { this.addEventListener('change', (event) => callback(/** @type {CustomEvent<FlowViewChangeEventDetail>} */ (event).detail)) }

	/** @param {FlowViewChangeEventDetail} detail */
	#emitChange(detail) { this.dispatchEvent(new CustomEvent('change', { detail })) }

	/** @type {ShadowRoot['append']} */
	#append(...args) { /** @type {ShadowRoot } */(this.shadowRoot).append(...args) }

	#copy() {
		this.#clipboardNodeIds.clear();
		for (const nodeId of this.#selectedNodeIds)
			this.#clipboardNodeIds.add(nodeId);
	}

	#paste() {
		this.#clearSelection();
		const links = new Set();
		const nodeIdsMap = new Map();
		/** @type {FlowViewGraphNodes} */ const newNodes = {};
		for (const link of this.#links.values())
			if (this.#clipboardNodeIds.has(link.source.node.id) && this.#clipboardNodeIds.has(link.target.node.id))
				links.add(link);
		for (const nodeId of this.#clipboardNodeIds) {
			const node = /** @type {Node} */ (this.#nodes.get(nodeId));
			const newPosition = add(node.position, xy(pinSize * 2, pinSize * 2));
			const id = this.#generateId();
			nodeIdsMap.set(nodeId, id);
			const newNode = this.#newNode({ text: node.text, ...newPosition }, id);
			newNodes[id] = newNode.toJSON();
			this.#selectNode(/** @type {Node} */ (this.#nodes.get(id)));
		}
		/** @type {FlowViewGraphLinks} */ const newLinks = {};
		for (const link of links) {
			const sourceNodeId = /** @type {string} */ (nodeIdsMap.get(link.source.node.id));
			const sourceIndex = link.source.index;
			const targetNodeId = /** @type {string} */ (nodeIdsMap.get(link.target.node.id));
			const targetIndex = link.target.index;

			const newLink = this.#newLink([sourceNodeId, sourceIndex], [targetNodeId, targetIndex]);
			newLinks[newLink.id] = newLink.sourceId;
		}
		this.#clipboardNodeIds.clear();
		this.#clipboardNodeIds = new Set(this.#selectedNodeIds);
		this.#emitChange({ create: { nodes: newNodes, links: newLinks } });
	}

	/**
	 * @param {FlowViewPinPath} source
	 * @param {FlowViewPinPath} target
	 * @returns {Link}
	 */
	#newLink([sourceNodeId, sourcePosition], [targetNodeId, targetPosition]) {
		const sourceNode = this.#nodes.get(sourceNodeId);
		const targetNode = this.#nodes.get(targetNodeId);
		if (!sourceNode || !targetNode)
			throw new Error('Node not found');
		const source = sourceNode.outputs[sourcePosition];
		const target = targetNode.inputs[targetPosition];
		if (!source || !target)
			throw new Error('Pin not found');
		// An Input can be connected only to one Link.
		const id = [targetNodeId, targetPosition].join();
		if (this.#links.has(id))
			throw new Error('Input already connected');
		const link = new Link(source, target, {
			delete: () => {
				this.#deleteLink(id);
				this.#emitChange({ delete: { links: { [link.id]: link.sourceId } } });
			},
			select: (isMulti) => {
				if (!isMulti) this.#clearSelection();
				this.#selectLink(link);
			}
		});
		this.#append(link.container.element);
		this.#links.set(id, link);
		this.#updateLinkPosition(link);
		return link;
	}

	/**
	 * @param {FlowViewGraphNode} arg
	 * @param {string=} id
	 * @returns {Node}
	 */
	#newNode({ x, y, text }, id = this.#generateId()) {
		const nodeType = this.nodeTextToType(text);
		const signature = nodeType ? this.nodeTypeSignature.get(nodeType) : {};
		const bodyCreator = this.nodeTextToBody(text) ?? defaultNodeBodyCreator;
		const node = new Node(id, text, { x, y }, signature ?? {}, {
			select: () => {
				this.#append(node.container.element);
				this.#pointedOutNode = node;
			}
		});
		node.container.element.append(node.inputsDiv, bodyCreator(node, this), node.outputsDiv);
		this.#append(node.container.element);
		node.container.dimensions = node.container.element.getBoundingClientRect();
		node.updatePinsOffset();
		this.#updateNodesPosition(node);
		this.#nodes.set(id, node);
		return node;
	}

	/**
	 * @param {string} id
	 * @returns {Pick<Link, 'id' | 'sourceId'> | undefined}
	 */
	#deleteLink(id) {
		const link = this.#links.get(id);
		if (!link) return;
		const sourceId = link.sourceId;
		link.source.container.highlight = false;
		link.target.container.highlight = false;
		// Dispose.
		this.#deselectLink(link);
		this.#links.delete(id);
		this.#ids.delete(id);
		link.dispose();
		return { id, sourceId };
	}

	/**
	 * @param {string} id
	 * @returns {FlowViewGraph | undefined}
	 */
	#deleteNode(id) {
		const node = this.#nodes.get(id);
		if (!node) return;
		/** @type {FlowViewGraphNodes} */ const nodes = {[id]: node.toJSON()};
		/** @type {FlowViewGraphLinks} */ const links = {};
		// Remove links connected to node.
		for (const [linkId, link] of this.#links.entries())
			if (link.source.node.id === id || link.target.node.id === id) {
				const deletedLink = this.#deleteLink(linkId);
				if (deletedLink)
					links[deletedLink.id] = deletedLink.sourceId;
			}
		// Dispose.
		this.#deselectNode(node);
		this.#nodes.delete(id);
		this.#ids.delete(id);
		node.dispose();
		return { nodes, links };
	}

	/** @param {MouseEvent} event */
	#pointerCoordinates({ clientX, clientY }) {
		const { x, y } = this.getBoundingClientRect();
		return xy(Math.round(clientX - x), Math.round(clientY - y))
	}

	/** @param {Vector} translation */
	#moveSelectedNodes(translation) {
		for (const nodeId of this.#selectedNodeIds) {
			const node = this.#nodes.get(nodeId);
			if (!node) continue;
			node.position = add(node.position, translation);
			this.#updateNodesPosition(node);
		}
		for (const link of this.#links.values())
			if (this.#selectedNodeIds.has(link.source.node.id) ||
				this.#selectedNodeIds.has(link.target.node.id))
				this.#updateLinkPosition(link);
	}

	/**
	 * @param {Pin} pin
	 * @param {Vector} position
	 * @returns {SemiLink} semiLink
	 */
	#newSemiLink(pin, position) {
		const semiLink = this.#semiLink = new SemiLink(pin, position);
		this.#append(semiLink.container.element);
		return semiLink
	}

	/** @param {Vector} pointer */
	#newSelection(pointer) {
		const selection = this.#selection = new Container(cssClass.selection);
		selection.position = pointer;
		selection.setElementPosition();
		selection.setElementDimensions();
		this.#append(selection.element);
		this.#selectionStartPosition = pointer;
	}

	#removeSelection() {
		if (!this.#selection) return;
		this.#selection.element.remove();
		this.#selection = undefined;
		this.#selectionStartPosition = undefined;
	}

	#startGrabbing() {
		if (this.#isGrabbing || this.#prompt || this.#selection || this.#semiLink) return;
		this.#isGrabbing = true;
		this.style.cursor = 'grabbing';
	}

	#stopGrabbing() {
		if (!this.#isGrabbing) return;
		this.style.cursor = 'default';
		this.#isGrabbing = false;
		this.#grabbingVector = undefined;
	}

	/** @param {Link | SemiLink} arg */
	#updateLinkPosition({ container, connection, start, end }) {
		const invertedX = end.x < start.x;
		const invertedY = end.y < start.y;

		const width = invertedX ? start.x - end.x + pinSize : end.x - start.x + pinSize;
		const height = invertedY ? start.y - end.y + pinSize : end.y - start.y + pinSize;

		container.position = sub(xy(invertedX ? end.x - halfPinSize : start.x - halfPinSize, invertedY ? end.y - halfPinSize : start.y - halfPinSize), this.#origin);
		container.setElementPosition();
		container.dimensions = { width, height };
		container.setElementDimensions();

		connection.dimensions = { width, height };
		connection.start = xy(invertedX ? width - halfPinSize : halfPinSize, invertedY ? height - halfPinSize : halfPinSize);
		connection.end = xy(invertedX ? halfPinSize : width - halfPinSize, invertedY ? halfPinSize : height - halfPinSize);
	}

	/** @param {Node} node */
	#updateNodesPosition(node) {
		node.container.position = sub(node.position, this.#origin);
		node.container.setElementPosition();
	}

	#updateNodesAndLinksPosition() {
		for (const node of this.#nodes.values())
			this.#updateNodesPosition(node);
		for (const link of this.#links.values())
			this.#updateLinkPosition(link);
	}

	/** @param {Vector} position */
	#updateSemiLinkPosition(position) {
		if (!this.#semiLink) return;
		if (this.#semiLink.pin instanceof Output)
			this.#semiLink.end = position;
		if (this.#semiLink.pin instanceof Input)
			this.#semiLink.start = position;
		this.#updateLinkPosition(this.#semiLink);
	}

	#deleteSelectedItems() {
		/** @type {FlowViewGraphNodes} */ const nodes = {};
		/** @type {FlowViewGraphLinks} */ const links = {};
		for (const id of this.#selectedNodeIds) {
			const changes = this.#deleteNode(id);
			if (!changes) continue;
			Object.assign(nodes, changes.nodes);
			Object.assign(links, changes.links);
		}
		this.#selectedNodeIds.clear();
		for (const id of this.#selectedLinkIds) {
			const link = this.#deleteLink(id);
			if (!link) continue;
			links[link.id] = link.sourceId;
		}
		this.#selectedLinkIds.clear();
		this.#emitChange({ delete: { nodes, links } });
	}

	/** @param {Link} link */
	#deselectLink(link) {
		link.isSelected = false;
		this.#selectedLinkIds.delete(link.id);
	}

	/** @param {Link} link */
	#selectLink(link) {
		link.isSelected = true;
		this.#selectedLinkIds.add(link.id);
	}

	/** @param {Node} node */
	#selectNode(node) {
		node.isSelected = true;
		this.#selectedNodeIds.add(node.id);
	}

	/** @param {Node} node */
	#deselectNode(node) {
		node.isSelected = false;
		this.#selectedNodeIds.delete(node.id);
	}

	/** @returns {string} id */
	#generateId() {
		const id = Math.random().toString(36).replace(/[^a-z]+/g, "").substring(0, 5);
		if (this.#ids.has(id))
			return this.#generateId();
		this.#ids.add(id);
		return id;
	}

	#clearSelection() {
		this.#pointedOutNode = undefined;
		for (const node of this.#nodes.values())
			this.#deselectNode(node);
		for (const link of this.#links.values())
			this.#deselectLink(link);
	}

	/** @param {Vector} pointer */
	#newPrompt(pointer) {
		this.#removePrompt();
		const prompt = this.#prompt = new Prompt(this.nodeList, pointer, {
			delete: this.#removePrompt.bind(this),
			newNode: text => {
				const node = this.#newNode({ text, ...add(pointer, this.#origin) })
				this.#emitChange({ create: { nodes: { [node.id]: node.toJSON() } } });
			}
		});
		this.#append(prompt.container.element);
		prompt.input.focus()
	}

	#removePrompt() {
		this.#prompt?.dispose();
		this.#prompt = undefined;
	}

	#removeSemiLink() {
		this.#semiLink?.dispose();
		this.#semiLink = undefined;
	}

	/**
	 * @param {Array<Input | Output>} pins
	 * @param {Vector} position
	 */
	#getClosestPin(pins, position) {
		const { x, y } = add(position, this.#origin);
		return pins.find(({ center }) => (
			(x >= center.x - pinSize && x <= center.x + pinSize) &&
			(y >= center.y - pinSize && y <= center.y + pinSize)
		));
	}
}

if (!customElements.get('flow-view')) customElements.define('flow-view', FlowView);
