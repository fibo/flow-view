import { FlowViewElement } from './element.js'

/**
 * @typedef {import('./types').FlowViewChangeInfo} FlowViewChangeInfo
 * @typedef {import('./types').FlowViewOnChangeCallback} FlowViewOnChangeCallback
 * @typedef {import('./types').FlowViewGraph} FlowViewGraph
 * @typedef {import('./types').FlowViewEdgeObj} FlowViewEdgeObj
 * @typedef {import('./types').FlowViewNodeObj} FlowViewNodeObj
 * @typedef {import('./types').FlowViewNodeType} FlowViewNodeType
 * @typedef {import('./types').FlowViewNodeDefinitions} FlowViewNodeDefinitions
 */

export class FlowView {
	/** @type {FlowViewElement} */
	view

	/** @type {FlowViewOnChangeCallback | undefined} */
	onViewChange

	/** @type {Map<string, FlowViewNodeType>} */
	nodeTypeDefinitionMap = new Map()

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

		this.view.style.isolation = 'isolate'

		this.nodeNameTypeMap = new Map()
		this.textToType = () => {}
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

	/** @param {FlowViewNodeDefinitions} */
	addNodeDefinitions({ nodes = [], types = {} }) {
		nodes.forEach(({ name, type }) => this.nodeNameTypeMap.set(name, type))
		Object.entries(types).forEach(([type, { ins, outs }]) =>
			this.nodeTypeDefinitionMap.set(type, { inputs: ins, outputs: outs })
		)
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
		{ createdNode, createdEdge, createdSemiEdge, deletedNode, deletedEdge, deletedSemiEdge, updatedNode },
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
		if (createdSemiEdge) {
			onViewChange({ action: 'CREATE_SEMI_EDGE', data: createdSemiEdge }, viewChangeInfo)
		}
		if (deletedNode) {
			onViewChange({ action: 'DELETE_NODE', data: deletedNode }, viewChangeInfo)
		}
		if (deletedEdge) {
			onViewChange({ action: 'DELETE_EDGE', data: deletedEdge }, viewChangeInfo)
		}
		if (deletedSemiEdge) {
			onViewChange({ action: 'DELETE_SEMI_EDGE', data: deletedSemiEdge }, viewChangeInfo)
		}
		if (updatedNode) {
			onViewChange?.({ action: 'UPDATE_NODE', data: updatedNode }, viewChangeInfo)
		}
	}

	/** @param {FlowViewEdgeObj} arg */
	newEdge(
		{ id, from: [sourceNodeId, sourcePinId], to: [targetNodeId, targetPinId] },
		viewChangeInfo = { isProgrammatic: true }
	) {
		const sourceNode = this.view.node(sourceNodeId)
		const targetNode = this.view.node(targetNodeId)
		const source = sourceNode.output(sourcePinId)
		const target = targetNode.input(targetPinId)

		return this.view.newEdge({ id, source, target }, viewChangeInfo)
	}

	/**
	 * @param {FlowViewNodeObj} node
	 * @param {FlowViewChangeInfo} viewChangeInfo
	 */
	newNode(node, viewChangeInfo = { isProgrammatic: true }) {
		return this.view.newNode(node, viewChangeInfo)
	}

	deleteNode(id, viewChangeInfo = { isProgrammatic: true }) {
		return this.view.deleteNode(id, viewChangeInfo)
	}

	deleteEdge(id, viewChangeInfo = { isProgrammatic: true }) {
		return this.view.deleteEdge(id, viewChangeInfo)
	}

	addNodeClass(key, NodeClass) {
		this.view.itemClassMap.set(key, NodeClass)
		if (!NodeClass.style) return
		const style = document.createElement('style')
		style.textContent = FlowViewElement.generateStylesheet(NodeClass.style)
		this.view.shadowRoot.appendChild(style)
	}

	nodeTextToType(textToType) {
		this.textToType = textToType
	}
}
