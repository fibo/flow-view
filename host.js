import { FlowViewElement } from "./view.js";

export class FlowView {
  static defineCustomElement() {
    const { customElementName } = FlowViewElement;

    if (!window.customElements.get(customElementName)) {
      window.customElements.define(customElementName, FlowViewElement);
    }
  }

  static nodeDefinitionIsValid(node) {
    if (node === null || typeof node !== "object") {
      throw new TypeError(
        "invalid flow-view node definition: must be an object",
      );
    }

    const { label, inputs, outputs } = node;

    if (
      typeof label !== "string" || label === "" ||
      FlowView.reservedTypes.includes(label)
    ) {
      throw new TypeError(
        `invalid flow-view node label: ${
          label === "" ? "empty string" : label
        }`,
      );
    }

    if (Array.isArray(inputs) && Array.isArray(outputs)) {
      for (const pin of inputs.concat(outputs)) {
        if (pin === null || typeof pin !== "object") {
          throw new TypeError("invalid flow-view node pin: must be an object");
        }

        const { name, types } = pin;

        // Attribute `name` is optional but, if provided,
        // must be a non empty string.
        if (typeof name !== "undefined") {
          if (typeof name !== "string" || name === "") {
            throw new TypeError(
              `invalid flow-view node pin name: ${
                name === ""
                  ? "empty string"
                  : name
              }`,
            );
          }
        }

        // Attribute `types` is optional but, if provided,
        // must be a non empty array of strings.
        if (typeof types !== "undefined") {
          if (Array.isArray(types) && types.length > 0) {
            for (const type of types) {
              if (typeof type !== "string" || type === "") {
                throw new TypeError(
                  `invalid flow-view node pin type: ${
                    type === ""
                      ? "empty string"
                      : type
                  }`,
                );
              }
            }
          } else {
            throw new TypeError(
              "invalid flow-view node pin, types must be a not empty array",
            );
          }
        }
      }
    } else {
      throw new TypeError(
        "invalid flow-view node, inputs or outputs are missing",
      );
    }
  }

  static reservedTypes = ["node", "edge"];

  constructor({ container, element, nodes = [] } = {}) {
    // 1. Define custom element.

    FlowView.defineCustomElement();

    // 2. Validate nodes.

    const nodeLabels = new Set();
    for (const node of nodes) {
      try {
        // Validate every node.
        FlowView.nodeDefinitionIsValid(node);

        // Check that node labels are unique.
        const { label } = node;
        if (nodeLabels.has(label)) {
          throw new TypeError(`duplicated flow-view node label ${label}`);
        } else {
          nodeLabels.add(label);
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
