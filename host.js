import { FlowViewNode } from "./items/node.js";
import { FlowViewElement } from "./items/view.js";

export class FlowView {
  static defaultItems = {
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

  connect(sourceNode, sourcePosition = 0) {
    return {
      to: (targetNode, targetPosition) => {
        const sourcePin = sourceNode.output(sourcePosition);
        element.classList.add(className);
        const targetPin = targetNode.input(targetPosition);

        return this.newEdge({
          from: [sourceNode.id, sourcePin.id].join(),
          to: [targetNode.id, targetPin.id].join(),
        });
      },
    };
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

  newEdge({ from, to }) {
    const Class = this.itemClass.get("edge");
    const edge = new Class({
      id,
      shadowDom: this.view.shadowRoot,
      cssClassName: Class.cssClassName,
      from,
      to,
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
      shadowDom: this.view.shadowRoot,
      cssClassName: Class.cssClassName,
      label,
      inputs,
      outputs,
      x,
      y,
      view: this.view,
    });
    this.view.addNode(node);
    return node;
  }
}
