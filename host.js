import { FlowViewErrorCannotCreateWebComponent } from "./errors.js";
import { FlowViewElement } from "./view.js";

export class FlowView {
	constructor(element) {
		if (!window.customElements.get(FlowViewElement.customElementName))
			window.customElements.define(FlowViewElement.customElementName, FlowViewElement);

		if (element instanceof FlowViewElement) {
			element.host = this;
			this.view = element;
		} else if (element instanceof HTMLElement) {
			const view = (this.view = document.createElement(FlowViewElement.customElementName));
			view.host = this;
			element.appendChild(view);
		} else {
			throw new FlowViewErrorCannotCreateWebComponent();
		}

		this.view.style.isolation = "isolate";

		this.nodeNameTypeMap = new Map();
		this.onViewChange = () => {};
		this.textToType = () => {};
	}

	get graph() {
		const {
			view: { nodes, edges },
		} = this;
		return {
			nodes: nodes.map((node) => node.toObject()),
			edges: edges.map((edge) => edge.toObject()),
		};
	}

	destroy() {
		this.view.parentNode.removeChild(this.view);
	}

	node(id) {
		return this.view.node(id);
	}

	edge(id) {
		return this.view.edge(id);
	}

	addNodeDefinitions({ nodes }) {
		nodes.forEach(({ name, type }) => this.nodeNameTypeMap.set(name, type));
	}

	addStyleSheet(styleSheet) {
		const style = document.createElement("style");
		style.textContent = styleSheet;
		this.view.shadowRoot.appendChild(style);
	}

	clearGraph() {
		this.view.clear({ isClearGraph: true });
	}

	loadGraph({ nodes = [], edges = [] }) {
		for (const node of nodes) this.newNode(node, { isLoadGraph: true });
		for (const edge of edges) this.newEdge(edge, { isLoadGraph: true });
	}

	onChange(value) {
		this.onViewChange = value;
	}

	viewChange(
		{ createdNode, createdEdge, createdSemiEdge, deletedNode, deletedEdge, deletedSemiEdge, updatedNode },
		viewChangeInfo = {}
	) {
		if (createdNode) {
			this.onViewChange(
				{
					action: "CREATE_NODE",
					data: createdNode,
				},
				viewChangeInfo
			);
		}
		if (createdEdge) {
			this.onViewChange(
				{
					action: "CREATE_EDGE",
					data: createdEdge,
				},
				viewChangeInfo
			);
		}
		if (createdSemiEdge) {
			this.onViewChange(
				{
					action: "CREATE_SEMI_EDGE",
					data: createdSemiEdge,
				},
				viewChangeInfo
			);
		}
		if (deletedNode) {
			this.onViewChange(
				{
					action: "DELETE_NODE",
					data: deletedNode,
				},
				viewChangeInfo
			);
		}
		if (deletedEdge) {
			this.onViewChange(
				{
					action: "DELETE_EDGE",
					data: deletedEdge,
				},
				viewChangeInfo
			);
		}
		if (deletedSemiEdge) {
			this.onViewChange(
				{
					action: "DELETE_SEMI_EDGE",
					data: deletedSemiEdge,
				},
				viewChangeInfo
			);
		}
		if (updatedNode) {
			this.onViewChange(
				{
					action: "UPDATE_NODE",
					data: updatedNode,
				},
				viewChangeInfo
			);
		}
	}

	newEdge(
		{ id, from: [sourceNodeId, sourcePinId], to: [targetNodeId, targetPinId] },
		viewChangeInfo = { isProgrammatic: true }
	) {
		const sourceNode = this.view.node(sourceNodeId);
		const targetNode = this.view.node(targetNodeId);
		const source = sourceNode.output(sourcePinId);
		const target = targetNode.input(targetPinId);

		return this.view.newEdge({ id, source, target }, viewChangeInfo);
	}

	newNode(node, viewChangeInfo = { isProgrammatic: true }) {
		return this.view.newNode(node, viewChangeInfo);
	}

	deleteNode(id, viewChangeInfo = { isProgrammatic: true }) {
		return this.view.deleteNode(id, viewChangeInfo);
	}

	deleteEdge(id, viewChangeInfo = { isProgrammatic: true }) {
		return this.view.deleteEdge(id, viewChangeInfo);
	}

	addNodeClass(key, NodeClass) {
		this.view.itemClassMap.set(key, NodeClass);
	}

	nodeTextToType(textToType) {
		this.textToType = textToType;
	}
}
