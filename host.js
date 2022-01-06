import { FlowViewElement } from "./view.js";

export class FlowView {
  static ErrorInvalidNodeDefinition = class ErrorInvalidNodeDefinition
    extends TypeError {
    constructor() {
      super("Invalid flow-view node definition");
    }
  };

  static ErrorDuplicatedNodeType = class ErrorDuplicatedNodeType
    extends TypeError {
    constructor() {
      super("Duplicated flow-view node type");
    }
  };

  static defineCustomElement() {
    const { customElementName } = FlowViewElement;

    if (!window.customElements.get(customElementName)) {
      window.customElements.define(customElementName, FlowViewElement);
    }
  }

  static nodeDefinitionIsValid(node) {
    if (node === null || typeof node !== "object") {
      throw new FlowView.ErrorInvalidNodeDefinition();
    }

    const { type, inputs, outputs } = node;

    if (
      typeof type !== "string" || type === "" ||
      FlowView.reservedTypes.includes(type)
    ) {
      throw new FlowView.ErrorInvalidNodeDefinition();
    }

    if (!Array.isArray(inputs) || !Array.isArray(outputs)) {
      throw new FlowView.ErrorInvalidNodeDefinition();
    }
  }

  static reservedTypes = ["node", "edge"];

  constructor({ container, element, nodes = [] } = {}) {
    // 1. Define custom element.

    FlowView.defineCustomElement();

    // 2. Validate nodes.

    const nodeTypes = new Set();
    for (const node of nodes) {
      try {
        // Validate every node.
        FlowView.nodeDefinitionIsValid(node);

        // Check that node types are unique.
        if (nodeTypes.has(node.type)) {
          throw new FlowView.ErrorDuplicatedNodeType();
        } else {
          nodeTypes.add(node.type);
        }
      } catch (error) {
        throw error;
      }
    }

    this.nodes = nodes;

    // 2. Create DOM element and attach host.

    if (element instanceof FlowViewElement) {
      // Apply custom element inline styles.
      element.style.isolation = "isolate";

      element.host = this;
      this.view = element;
    } else {
      const view = this.view = document.createElement(
        FlowViewElement.customElementName,
      );

      // Apply custom element inline styles.
      view.style.isolation = "isolate";

      view.host = this;

      if (container instanceof HTMLElement) {
        container.appendChild(view);
      } else {
        document.body.appendChild(view);
      }
    }

    // 3. Other initializations.

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
