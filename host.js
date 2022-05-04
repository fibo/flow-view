import { FlowViewElement } from "./view.js";
import { FlowViewErrorItemNotFound } from "./errors.js";

export class FlowView {
  static defineCustomElement(CustomElement) {
    const { customElementName } = CustomElement;

    if (!window.customElements.get(customElementName)) {
      window.customElements.define(customElementName, CustomElement);
    }
  }

  constructor({ container, element, CustomElement = FlowViewElement } = {}) {
    // 1. Define custom element.

    FlowView.defineCustomElement(CustomElement);

    // 2. Create DOM element and attach host.

    const applyInlineStyles = (style) => {
      style.isolation = "isolate";
    };

    if (element instanceof CustomElement) {
      applyInlineStyles(element.style);

      element.host = this;
      this.view = element;
    } else {
      const view = (this.view = document.createElement(
        CustomElement.customElementName
      ));
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
    const {
      view: { nodes, edges },
    } = this;

    return {
      nodes: nodes.map((node) => node.toObject()),
      edges: edges.map((edge) => edge.toObject()),
    };
  }

  node(id) {
    const item = this.view.node(id);
    if (!item) {
      throw new FlowViewErrorItemNotFound({ kind: "node", id });
    }
    return item;
  }

  edge(id) {
    const item = this.view.edge(id);
    if (!item) {
      throw new FlowViewErrorItemNotFound({ kind: "edge", id });
    }
    return item;
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
    { createdNode, createdEdge, deletedNode, deletedEdge, updatedNode },
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

  addNodeClass(nodeClassKey, NodeClass) {
    this.view.itemClass.set(nodeClassKey, NodeClass);
  }
}
