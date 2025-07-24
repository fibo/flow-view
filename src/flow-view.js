import { FlowViewElement } from './element.js';

export { FlowViewNode } from './node.js';

/**
 * @typedef {import('./types').FlowViewGraph} FlowViewGraph
 * @typedef {import('./types').FlowViewEdgeObj} FlowViewEdgeObj
 * @typedef {import('./types').FlowViewNodeObj} FlowViewNodeObj
 * @typedef {import('./types').FlowViewNodeSignature} FlowViewNodeSignature
 */

export class FlowView {
	/** @type {FlowViewElement} */
	view

	/** @type {Set<string>} */
	nodeList = new Set()

	/** @type {Map<string, FlowViewNodeSignature>} */
	nodeTypeSignature = new Map()

	/** @type {((text: string) => string | undefined) | undefined} */
	nodeTextToType

	/** @param {Element} element */
	constructor(element) {
		if (!customElements.get('flow-view'))
			customElements.define('flow-view', FlowViewElement)

		if (element instanceof FlowViewElement) {
			element.host = this
			this.view = element
		} else if (element instanceof HTMLElement) {
			const view = document.createElement('flow-view')
			// @ts-ignore
			view.host = this
			element.appendChild(view)
			// @ts-ignore
			this.view = view
		} else {
			throw new Error('flow-view was provided with no valid element nor container')
		}

		this.nodeNameTypeMap = new Map()
	}

	get graph() {
		const {
			view: { nodes, edges }
		} = this
		return {
			nodes: nodes.map((node) => node.toObject()),
			edges: edges.map((edge) => edge.toObject())
		}
	}

	destroy() {
		this.view.parentNode?.removeChild(this.view)
	}

	/** @param {string} id */
	node(id) {
		return this.view.node(id)
	}

	/** @param {string} id */
	edge(id) {
		return this.view.edge(id)
	}

	/** @param {FlowViewGraph} graph */
	loadGraph({ nodes = [], edges = [] }) {
		for (const node of nodes) this.newNode(node)
		for (const edge of edges) this.newEdge(edge)
	}

	/**
	 * @param {FlowViewEdgeObj} edge
	 */
	newEdge({ id, from, to }) {
		return this.view.newEdge({ id, from, to })
	}

	/**
	 * @param {FlowViewNodeObj} node
	 */
	newNode(node) {
		return this.view.newNode(node)
	}

	/**
	 * @param {string} id
	 */
	deleteNode(id) {
		return this.view.deleteNode(id)
	}

	/**
	 * @param {string} id
	 */
	deleteEdge(id) {
		return this.view.deleteEdge(id)
	}
}
