import { FlowViewElement } from "./view.js";

export class FlowView {
  static defineCustomElement() {
    const { customElementName } = FlowViewElement;

    if (!window.customElements.get(customElementName)) {
      window.customElements.define(customElementName, FlowViewElement);
    }
  }

  constructor({ container, element } = {}) {
    // 1. Define custom element.

    FlowView.defineCustomElement();

    // 2. Create DOM element and attach host.

    const applyInlineStyles = (style) => {
      style.isolation = "isolate";
    };

    if (element instanceof FlowViewElement) {
      applyInlineStyles(element.style);

      element.host = this;
      this.view = element;
    } else {
      const view = this.view = document.createElement(
        FlowViewElement.customElementName,
      );
      view.host = this;

      applyInlineStyles(view.style);

      if (container instanceof HTMLElement) {
        container.appendChild(view);
      } else {
        document.body.appendChild(view);
      }
    }

    // 3. Other initializations.

    this.nodeLabels = new Set();

    this._onViewChange = () => {};
  }

  get graph() {
    const { view: { nodes, edges } } = this;

    return {
      nodes: nodes.map((node) => node.toObject()),
      edges: edges.map((edge) => edge.toObject()),
    };
  }

  node(id) {
    return this.view.node(id);
  }

  edge(id) {
    return this.view.edge(id);
  }

  addNodeLabels(nodeLabels) {
    if (Array.isArray(nodeLabels)) {
      nodeLabels.forEach((nodeLabel) => {
        if (typeof nodeLabel === "string" && nodeLabel !== "") {
          this.nodeLabels.add(nodeLabel);
        }
      });
    }
  }

  clearGraph() {
    this.view.clear({ isClearGraph: true });
  }

  loadGraph({ nodes = [], edges = [] }) {
    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      throw new TypeError("Invalid graph");
    }
    // Create nodes first...
    for (const node of nodes) {
      this.newNode(node, { isLoadGraph: true });
    }
    // ...then create edges.
    for (const edge of edges) {
      this.newEdge(edge, { isLoadGraph: true });
    }
  }

  get onViewChange() {
    return this._onViewChange;
  }

  onChange(value) {
    if (typeof value === "function") {
      this._onViewChange = value;
    }
  }

  viewChange(
    { createdNode, createdEdge, deletedNode, deletedEdge },
    viewChangeInfo = {},
  ) {
    if (createdNode) {
      this.onViewChange({
        action: "CREATE_NODE",
        data: createdNode,
      }, viewChangeInfo);
    }
    if (createdEdge) {
      this.onViewChange({
        action: "CREATE_EDGE",
        data: createdEdge,
      }, viewChangeInfo);
    }
    if (deletedNode) {
      this.onViewChange({
        action: "DELETE_NODE",
        data: deletedNode,
      }, viewChangeInfo);
    }
    if (deletedEdge) {
      this.onViewChange({
        action: "DELETE_EDGE",
        data: deletedEdge,
      }, viewChangeInfo);
    }
  }

  newEdge({
    id,
    from: [sourceNodeId, sourcePinId],
    to: [targetNodeId, targetPinId],
  }, viewChangeInfo = { isProgrammatic: true }) {
    const sourceNode = this.view.node(sourceNodeId);
    const targetNode = this.view.node(targetNodeId);
    const source = sourceNode.output(sourcePinId);
    const target = targetNode.input(targetPinId);

    return this.view.newEdge({ id, source, target }, viewChangeInfo);
  }

  newNode({
    id,
    label,
    nodeType,
    inputs,
    outputs,
    x,
    y,
  } = {}, viewChangeInfo = { isProgrammatic: true }) {
    return this.view.newNode(
      { id, label, nodeType, inputs, outputs, x, y },
      viewChangeInfo,
    );
  }

  deleteNode(id, viewChangeInfo = { isProgrammatic: true }) {
    return this.view.deleteNode(id, viewChangeInfo);
  }

  deleteEdge(id, viewChangeInfo = { isProgrammatic: true }) {
    return this.view.deleteEdge(id, viewChangeInfo);
  }
}
