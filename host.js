import { FlowViewElement } from "./view.js";

export class FlowView {
  static defineCustomElement() {
    const { customElementName } = FlowViewElement;

    if (!window.customElements.get(customElementName)) {
      window.customElements.define(customElementName, FlowViewElement);
    }
  }

  constructor({ container, element } = {}) {
    FlowView.defineCustomElement();

    if (element instanceof FlowViewElement) {
      element.host = this;
      this.view = element;
    } else {
      const view = this.view = document.createElement(
        FlowViewElement.customElementName,
      );
      view.host = this;

      if (container instanceof HTMLElement) {
        container.appendChild(view);
      } else {
        document.body.appendChild(view);
      }
    }

    this._onViewChange = () => {};
  }

  clearGraph() {
    this.view.nodes.clear();
    this.view.edges.clear();
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

  viewChange(args) {
    this.onViewChange(args);
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
