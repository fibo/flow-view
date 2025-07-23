import { FlowViewElement } from './element.js';

export { FlowViewNode } from './node.js';

/**
 * @typedef {import('./types').FlowViewChangeInfo} FlowViewChangeInfo
 * @typedef {import('./types').FlowViewOnChangeCallback} FlowViewOnChangeCallback
 * @typedef {import('./types').FlowViewGraph} FlowViewGraph
 * @typedef {import('./types').FlowViewEdgeObj} FlowViewEdgeObj
 * @typedef {import('./types').FlowViewNodeObj} FlowViewNodeObj
 * @typedef {import('./types').FlowViewNodeSignature} FlowViewNodeSignature
 */

export class FlowView {
	/** @type {FlowViewElement} */
	view

	/** @type {FlowViewOnChangeCallback | undefined} */
	onViewChange

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

	clearGraph() {
		this.view.clear({ isClearGraph: true })
	}

	/** @param {FlowViewGraph} graph */
	loadGraph({ nodes = [], edges = [] }) {
		for (const node of nodes) this.newNode(node, { isLoadGraph: true })
		for (const edge of edges) this.newEdge(edge, { isLoadGraph: true })
	}

	/** @param {FlowViewOnChangeCallback} callback */
	onChange(callback) {
		this.onViewChange = callback
	}

	viewChange(
		// @ts-ignore
		{ createdNode, createdEdge, deletedNode, deletedEdge, updatedNode },
		viewChangeInfo = {}
	) {
		const { onViewChange } = this
		if (!onViewChange) return

		if (createdNode) {
			onViewChange({ action: 'CREATE_NODE', data: createdNode }, viewChangeInfo)
		}
		if (createdEdge) {
			onViewChange({ action: 'CREATE_EDGE', data: createdEdge }, viewChangeInfo)
		}
		if (deletedNode) {
			onViewChange({ action: 'DELETE_NODE', data: deletedNode }, viewChangeInfo)
		}
		if (deletedEdge) {
			onViewChange({ action: 'DELETE_EDGE', data: deletedEdge }, viewChangeInfo)
		}
		if (updatedNode) {
			onViewChange?.({ action: 'UPDATE_NODE', data: updatedNode }, viewChangeInfo)
		}
	}

	/**
	 * @param {FlowViewEdgeObj} edge
	 * @param {FlowViewChangeInfo} viewChangeInfo
	 */
	newEdge({ id, from, to }, viewChangeInfo = { isProgrammatic: true }) {
		return this.view.newEdge({ id, from, to }, viewChangeInfo)
	}

	/**
	 * @param {FlowViewNodeObj} node
	 * @param {FlowViewChangeInfo} viewChangeInfo
	 */
	newNode(node, viewChangeInfo = { isProgrammatic: true }) {
		return this.view.newNode(node, viewChangeInfo)
	}

	/**
	 * @param {string} id
	 * @param {FlowViewChangeInfo} viewChangeInfo
	 */
	deleteNode(id, viewChangeInfo = { isProgrammatic: true }) {
		return this.view.deleteNode(id, viewChangeInfo)
	}

	/**
	 * @param {string} id
	 * @param {FlowViewChangeInfo} viewChangeInfo
	 */
	deleteEdge(id, viewChangeInfo = { isProgrammatic: true }) {
		return this.view.deleteEdge(id, viewChangeInfo)
	}
}
