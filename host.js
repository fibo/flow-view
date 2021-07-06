import { FlowViewElement } from "./view.js";
import { FlowViewEdge } from "./items/edge.js";
import { FlowViewNode } from "./items/node.js";

export class FlowView {
  static defaultItems = {
    edge: FlowViewEdge,
    node: FlowViewNode,
  };

  static defineCustomElement() {
    const { customElementName } = FlowViewElement;

    if (!window.customElements.get(customElementName)) {
      window.customElements.define(customElementName, FlowViewElement);
    }
  }

  constructor(
    { container, element } = {},
  ) {
    FlowView.defineCustomElement();

    const itemClass = this.itemClass = new Map();
    Object.entries(FlowView.defaultItems).forEach(([key, Class]) => {
      itemClass.set(key, Class);
    });

    if (element instanceof FlowViewElement) {
      this.view = element;
    } else {
      this.view = document.createElement(FlowViewElement.customElementName);

      if (!element.parentNode) {
        if (container instanceof HTMLElement) {
          container.appendChild(element);
        } else {
          document.body.appendChild(element);
        }
      }
    }
  }

  clearGraph() {
    this.view.nodes.clear();
    this.view.edges.clear();
  }

  loadGraph({ nodes = [], edges = [] }) {
    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      throw new TypeError("Invalid graph");
    }

    for (const node of nodes) {
      this.newNode(node);
    }

    for (const edge of edges) {
      this.newEdge(edge);
    }
  }

  newEdge(
    { id, from: [sourceNodeId, sourcePinId], to: [targetNodeId, targetPinId] },
  ) {
    const sourceNode = this.view.node(sourceNodeId);
    const targetNode = this.view.node(targetNodeId);
    const source = sourceNode.output(sourcePinId);
    const target = targetNode.input(targetPinId);

    const Class = this.itemClass.get("edge");
    const edge = new Class({
      id,
      view: this.view,
      cssClassName: Class.cssClassName,
      source,
      target,
    });
    this.view.addEdge(edge);
    return edge;
  }

  newNode({
    x = 0,
    y = 0,
    label = "node",
    id,
    nodeType = "node",
    inputs = [],
    outputs = [],
  } = {}) {
    const Class = this.itemClass.get(nodeType);
    const node = new Class({
      id,
      view: this.view,
      cssClassName: Class.cssClassName,
      label,
      inputs,
      outputs,
      x,
      y,
    });
    this.view.addNode(node);
    return node;
  }
}
