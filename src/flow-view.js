import { FlowViewElement } from "./element.js";

/**
 * @typedef {import("./element").FlowViewElement} FlowViewHTMLElement
 * @typedef {import("./types").Edge} Edge
 * @typedef {import("./types").OnViewChange} OnViewChange
 * @typedef {import("./types").ViewChangeAction} ViewChangeAction
 * @typedef {import("./types").ViewChangeInfo} ViewChangeInfo
 */

export class FlowView {
	/**
	 * @param {HTMLElement| FlowViewHTMLElement} element
	*/
  constructor(element) {
    if (!window.customElements.get(FlowViewElement.customElementName)) {
      window.customElements.define(
        FlowViewElement.customElementName,
        FlowViewElement,
      );
    }

    if (element instanceof FlowViewElement) {
      element.host = this;
      this.view = element;
    } else if (element instanceof HTMLElement) {
      const view = document.createElement(FlowViewElement.customElementName);
	    // @ts-ignore
      view.host = this;
      element.appendChild(view);
      this.view = view;
    } else throw new TypeError("No valid element nor container");

    this.view.style.isolation = "isolate";

    this.nodeNameTypeMap = new Map();
    this.nodeTypeDefinitionMap = new Map();
	  /** @type {OnViewChange} */
    this.onViewChange = (_action, _viewChangeInfo) => {};
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
    this.view.parentNode?.removeChild(this.view);
  }

	/** @param {string} id */
  node(id) {
	  // @ts-ignore
    return this.view.node(id);
  }

	/** @param {string} id */
  edge(id) {
	  // @ts-ignore
    return this.view.edge(id);
  }

  addNodeDefinitions({ nodes = [], types = {} }) {
    nodes.forEach(({ name, type }) => this.nodeNameTypeMap.set(name, type));
    Object.entries(types).forEach(([type, { inputs, outputs }]) =>
      this.nodeTypeDefinitionMap.set(type, { inputs, outputs })
    );
  }

  clearGraph() {
	  // @ts-ignore
    this.view.clear({ isClearGraph: true });
  }

  loadGraph({ nodes = [], edges = [] }) {
    for (const node of nodes) this.newNode(node, { isLoadGraph: true });
    for (const edge of edges) this.newEdge(edge, { isLoadGraph: true });
  }

	/** @param {OnViewChange} value */
  onChange(value) {
    this.onViewChange = value;
  }

	/**
	 * @param {ViewChangeAction} action
	 * @param {ViewChangeInfo} viewChangeInfo
	 */
  viewChange(
    {
      createdNode,
      createdEdge,
      createdSemiEdge,
      deletedNode,
      deletedEdge,
      deletedSemiEdge,
      updatedNode,
    },
    viewChangeInfo,
  ) {
    if (createdNode) {
      this.onViewChange(
        { action: "CREATE_NODE", data: createdNode },
        viewChangeInfo,
      );
    }
    if (createdEdge) {
      this.onViewChange(
        { action: "CREATE_EDGE", data: createdEdge },
        viewChangeInfo,
      );
    }
    if (createdSemiEdge) {
      this.onViewChange(
        { action: "CREATE_SEMI_EDGE", data: createdSemiEdge },
        viewChangeInfo,
      );
    }
    if (deletedNode) {
      this.onViewChange(
        { action: "DELETE_NODE", data: deletedNode },
        viewChangeInfo,
      );
    }
    if (deletedEdge) {
      this.onViewChange(
        { action: "DELETE_EDGE", data: deletedEdge },
        viewChangeInfo,
      );
    }
    if (deletedSemiEdge) {
      this.onViewChange(
        { action: "DELETE_SEMI_EDGE", data: deletedSemiEdge },
        viewChangeInfo,
      );
    }
    if (updatedNode) {
      this.onViewChange(
        { action: "UPDATE_NODE", data: updatedNode },
        viewChangeInfo,
      );
    }
  }

	/**
	 * @param {Edge} edge
	 * @param {ViewChangeInfo} viewChangeInfo
	*/
  newEdge(
    { id, from: [sourceNodeId, sourcePinId], to: [targetNodeId, targetPinId] },
    viewChangeInfo = { isProgrammatic: true },
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
    if (NodeClass.style) {
      try {
        const style = document.createElement("style");
        style.textContent = FlowViewElement.generateStylesheet(NodeClass.style);
        this.view.shadowRoot.appendChild(style);
      } catch (error) {
        console.error(error);
        throw new Error("flow-view cannot load style for custom element");
      }
    }
  }

  nodeTextToType(textToType) {
    this.textToType = textToType;
  }
}
