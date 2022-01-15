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
    this.view.clear();
  }

  loadGraph({ nodes = [], edges = [] }) {
    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      throw new TypeError("Invalid graph");
    }
    // Create nodes first...
    for (const node of nodes) {
      this.newNode(node);
    }
    // ...then create edges.
    for (const edge of edges) {
      this.newEdge(edge);
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

  viewChange({ createdNode, createdEdge, deletedNode, deletedEdge }) {
    if (createdNode) {
      this.onViewChange({
        action: 'CREATE_NODE',
        data: createdNode,
      });
    }
    if (createdEdge) {
      this.onViewChange({
        action: "CREATE_EDGE",
        data: createdEdge,
      });
    }
    if (deletedNode) {
      this.onViewChange({
        action: "DELETE_NODE",
        data: deletedNode,
      });
    }
    if (deletedEdge) {
      this.onViewChange({
        action: "DELETE_EDGE",
        data: deletedEdge,
      });
    }
  }

  newEdge({
    id,
    from: [sourceNodeId, sourcePinId],
    to: [targetNodeId, targetPinId],
  }) {
    const sourceNode = this.view.node(sourceNodeId);
    const targetNode = this.view.node(targetNodeId);
    const source = sourceNode.output(sourcePinId);
    const target = targetNode.input(targetPinId);

    return this.view.newEdge({ id, source, target });
  }

  newNode({
    id,
    label,
    nodeType,
    inputs,
    outputs,
    x,
    y,
  } = {}) {
    return this.view.newNode({ id, label, nodeType, inputs, outputs, x, y });
  }
}
