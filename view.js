import { cssTheme, cssVar } from "./theme.js";
import { FlowViewEdge } from "./items/edge.js";
import { FlowViewNode } from "./items/node.js";
import { FlowViewPin } from "./items/pin.js";
import { FlowViewSelector } from "./items/selector.js";

export class FlowViewElement extends HTMLElement {
  static customElementName = "flow-view";
  static minHeight = 200;
  static defaultItems = {
    edge: FlowViewEdge,
    node: FlowViewNode,
  };

  static style = {
    ":host([hidden])": {
      "display": "none",
    },
    ":host": {
      ...cssTheme("light"),
      "position": "relative",
      "display": "block",
      "overflow": "hidden",
      "border": 0,
      "margin": 0,
      "outline": 0,
      "background-color": cssVar.backgroundColor,
      "border-radius": cssVar.borderRadius,
      "box-shadow": cssVar.boxShadow,
      "font-family": cssVar.fontFamily,
      "font-size": cssVar.fontSize,
      "color": cssVar.textColor,
    },
    ...FlowViewEdge.style,
    ...FlowViewNode.style,
    ...FlowViewPin.style,
    ...FlowViewSelector.style,
  };

  static generateStylesheet(style) {
    return Object.entries(style).reduce((stylesheet, [selector, rules]) => (
      [
        stylesheet,
        `${selector}{`,
        Object.entries(rules).map(
          ([key, value]) => `${key}:${value};`,
        ).join(""),
        "}",
      ].join("")
    ), "");
  }

  static pointerCoordinates(event) {
    const { clientX, clientY, target } = event;
    const { left, top } = target.getBoundingClientRect();

    const x = Math.round(clientX - left);
    const y = Math.round(clientY - top);

    return { x, y };
  }

  constructor() {
    super();

    const template = document.createElement("template");

    template.innerHTML = [
      "<style>",
      FlowViewElement.generateStylesheet(FlowViewElement.style),
      "@media(prefers-color-scheme:dark){",
      FlowViewElement.generateStylesheet({ ":host": cssTheme("dark") }),
      "}",
      "</style>",
    ].join("");

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true),
    );

    this._origin = { x: 0, y: 0 };

    this._nodes = new Map();
    this._edges = new Map();

    const itemClass = this.itemClass = new Map();
    Object.entries(FlowViewElement.defaultItems).forEach(([key, Class]) => {
      itemClass.set(key, Class);
    });
  }

  get host() {
    return this._host || { viewChange: () => {} };
  }

  set host(value) {
    this._host = value;
  }

  connectedCallback() {
    if (this.canResize) {
      this.rootResizeObserver = new ResizeObserver(
        this.onRootResize.bind(this),
      );
      this.rootResizeObserver.observe(this.parentNode);
    } else {
      this.height = this.getAttribute("height") || FlowViewElement.minHeight;
    }

    if (!this.getAttribute("tabindex")) {
      this.setAttribute("tabindex", 0);
    }

    this.addEventListener("dblclick", this.onDblclick);
    this.addEventListener("keydown", this.onKeydown);
    this.addEventListener("pointerdown", this.onPointerdown);
    this.addEventListener("pointermove", this.onPointermove);
    this.addEventListener("pointerleave", this.onPointerleave);
    this.addEventListener("pointerup", this.onPointerup);
  }

  disconnectedCallback() {
    // Remove eventListeners
    if (this.canResize) {
      this.rootResizeObserver.unobserve(this.parentNode);
    }
    this.removeEventListener("dblclick", this.onDblclick);
    this.removeEventListener("keydown", this.onKeydown);
    this.removeEventListener("pointerdown", this.onPointerdown);
    this.removeEventListener("pointermove", this.onPointermove);
    this.removeEventListener("pointerleave", this.onPointerleave);
    this.removeEventListener("pointerup", this.onPointerup);
  }

  get canResize() {
    return "ResizeObserver" in window;
  }

  get origin() {
    if (this.translateVector && !this.hasSelectedNodes) {
      return {
        x: this._origin.x + this.translateVector.x,
        y: this._origin.y + this.translateVector.y,
      };
    } else {
      return this._origin;
    }
  }

  get selectedEdges() {
    return this.edges.filter((edge) => edge.isSelected);
  }

  get hasSelectedNodes() {
    return this.selectedNodes.length > 0;
  }

  get isDraggingEdge() {
    return this.semiEdge instanceof FlowViewEdge;
  }

  get selectedNodeIds() {
    return this.selectedNodes.map((node) => node.id);
  }

  get selectedNodes() {
    return this.nodes.filter((node) => node.isSelected);
  }

  get edges() {
    return Array.from(this._edges.values());
  }

  get nodes() {
    return Array.from(this._nodes.values());
  }

  get height() {
    return parseInt(this.style.height);
  }

  set height(value) {
    this.style.height = `${value}px`;
  }

  get width() {
    return parseInt(this.style.width);
  }

  set width(value) {
    this.style.width = `${value}px`;
  }

  clear() {
    this.nodes.forEach((node) => {
      this.deleteNode(node.id);
    });
  }

  newEdge({ id, source, target }) {
    const Class = this.itemClass.get("edge");
    const edge = new Class({
      id,
      view: this,
      cssClassName: Class.cssClassName,
      source,
      target,
    });
    this.addEdge(edge);
    this.host.viewChange({ createdEdge: edge.toObject() });
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
  }) {
    const Class = this.itemClass.get(nodeType);
    const node = new Class({
      id,
      view: this,
      cssClassName: Class.cssClassName,
      label,
      inputs,
      outputs,
      x,
      y,
    });
    this.addNode(node);
    this.host.viewChange({ createdNode: node.toObject() });
    return node;
  }

  selectEdge(edge) {
    edge.highlight = true;
    edge.selected = true;
    edge.source.highlight = true;
    edge.target.highlight = true;
  }

  selectNode(node) {
    node.highlight = true;
    node.selected = true;
    // Highlight inputs and outputs
    for (const input of node.inputs) {
      input.highlight = true;
    }
    for (const output of node.outputs) {
      output.highlight = true;
    }
    // Select edges which source and target are in selected nodes.
    for (const edge of this.edges) {
      if (edge.source.node.isSelected && edge.target.node.isSelected) {
        this.selectEdge(edge);
      } else {
        this.deselectEdge(edge);
      }
    }
  }

  deselectEdge(edge) {
    edge.highlight = false;
    edge.selected = false;
    if (!edge.source.node.isSelected) {
      edge.source.highlight = false;
    }
    if (!edge.target.node.isSelected) {
      edge.target.highlight = false;
    }
  }

  deselectNode(node) {
    node.highlight = false;
    node.selected = false;
    for (const input of node.inputs) {
      input.highlight = false;
    }
    for (const output of node.outputs) {
      output.highlight = false;
    }
  }

  addEdge(edge) {
    this._edges.set(edge.id, edge);
  }

  addNode(node) {
    this._nodes.set(node.id, node);
  }

  deleteEdge(id) {
    const edge = this._edges.get(id)
    if (!edge) return

    edge.source.highlight = false;
    edge.target.highlight = false;

    // Dispose.
    this._edges.delete(edge.id);
    edge.remove();

    const serializedEdge = edge.toObject()
    this.host.viewChange({ deletedEdge: serializedEdge });
    return serializedEdge
  }

  deleteNode(id) {
    const node = this._nodes.get(id)
    if (!node) return

    // Remove edges connected to node.
    for (const edge of this.edges) {
      if (edge.source.node.id === node.id || edge.target.node.id === node.id) {
        this.deleteEdge(edge.id);
      }
    }

    // Dispose.
    this._nodes.delete(node.id);
    node.remove();

    const serializedNode = node.toObject()
    this.host.viewChange({ deletedNode: serializedNode });
    return serializedNode
  }

  edge(id) {
    return this._edges.get(id);
  }

  node(id) {
    return this._nodes.get(id);
  }

  startTranslation(event) {
    this.startDraggingPoint = FlowViewElement.pointerCoordinates(event);
    this.translateVector = { x: 0, y: 0 };
    if (this.hasSelectedNodes) {
      const selectedNodesStartPosition = {};
      for (const node of this.selectedNodes) {
        selectedNodesStartPosition[node.id] = node.position;
      }
      this.selectedNodesStartPosition = selectedNodesStartPosition;
    }
  }

  stopTranslation() {
    if (this.translateVector && !this.hasSelectedNodes && !this.semiEdge) {
      this._origin = {
        x: this._origin.x + this.translateVector.x,
        y: this._origin.y + this.translateVector.y,
      };
    }

    this.translateVector = undefined;
    this.startDraggingPoint = undefined;
    this.selectedNodesStartPosition = undefined;
  }

  createSelector({ position }) {
    return this.selector = new FlowViewSelector({
      id: "selector",
      view: this,
      cssClassName: FlowViewSelector.cssClassName,
      position,
      nodeLabels: Array.from(this.host.nodeLabels),
    });
  }

  onDblclick(event) {
    const { origin } = this;

    this.clearSelection();
    this.removeSelector();

    const pointerPosition = FlowViewElement.pointerCoordinates(event);

    const selector = this.createSelector({
      position: {
        x: pointerPosition.x + origin.x,
        y: pointerPosition.y + origin.y,
      },
    });
    selector.focus();
  }

  onKeydown(event) {
    event.stopPropagation();

    switch (true) {
      case this.selector instanceof FlowViewSelector: {
        return;
      }
      case event.code === "Backspace": {
        this.deleteSelectedItems();
        break;
      }
      case event.code === "Escape": {
        this.clearSelection();
        break;
      }
      case "KeyU": {
        this.undo();
        break;
      }
      case "KeyR": {
        this.redo();
        break;
      }
      default: {
        // console.log(event.code);
      }
    }
  }

  onPointerdown(event) {
    event.stopPropagation();
    this.removeSelector();
    if (!event.isBubblingFromNode) {
      this.clearSelection();
    }
    this.startTranslation(event);
  }

  onPointermove(event) {
    const { hasSelectedNodes, semiEdge, startDraggingPoint } = this;

    if (startDraggingPoint) {
      const pointerPosition = FlowViewElement.pointerCoordinates(event);
      const x = startDraggingPoint.x - pointerPosition.x;
      const y = startDraggingPoint.y - pointerPosition.y;

      switch (true) {
        case !!semiEdge: {
          const { origin } = this;

          if (!semiEdge.hasTarget) {
            semiEdge.target.center.x = pointerPosition.x + origin.x;
            semiEdge.target.center.y = pointerPosition.y + origin.y;
          }
          semiEdge.updateGeometry();
          break;
        }

        case hasSelectedNodes: {
          this.translateVector = { x, y };
          const {
            edges,
            selectedNodes,
            selectedNodeIds,
            selectedNodesStartPosition,
          } = this;

          for (const node of selectedNodes) {
            const { x: startX, y: startY } =
              selectedNodesStartPosition[node.id];
            node.position = { x: startX - x, y: startY - y };
          }
          for (const edge of edges) {
            if (
              selectedNodeIds.includes(edge.source.node.id) ||
              selectedNodeIds.includes(edge.target.node.id)
            ) {
              edge.updateGeometry();
            }
          }

          break;
        }

        default: {
          this.translateVector = { x, y };
          const { nodes, edges } = this;

          for (const node of nodes) {
            // Just trigger position setter, since it reads view origin.
            const { x, y } = node.position;
            node.position = { x, y };
          }

          for (const edge of edges) {
            edge.updateGeometry();
          }
        }
      }
    }
  }

  onPointerleave() {
    this.stopTranslation();
  }

  onPointerup() {
    this.stopTranslation();
    this.removeSemiEdge();
  }

  onRootResize(entries) {
    for (const entry of entries) {
      // Only listen to parentNode
      if (this.parentNode === entry.target) {
        // Try with contentBoxSize
        const contentBoxSize = Array.isArray(entry.contentBoxSize)
          ? entry.contentBoxSize[0]
          : entry.contentBoxSize;
        if (contentBoxSize) {
          this.width = contentBoxSize.inlineSize;
          this.height = contentBoxSize.blockSize - 10;
        } else {
          // Fallback to contentRect
          if (entry.contentRect) {
            this.width = entry.contentRect.width;
            this.height = entry.contentRect.height;
          }
        }
      }
    }
  }

  createSemiEdge({ source, target }) {
    const Class = this.itemClass.get("edge");
    return this.semiEdge = new Class({
      view: this,
      cssClassName: Class.cssClassName,
      source,
      target,
    });
  }

  clearSelection() {
    // First deselect nodes...
    for (const node of this.selectedNodes) {
      this.deselectNode(node);
    }
    // ...then deselect edges
    for (const edge of this.selectedEdges) {
      this.deselectEdge(edge);
    }
  }

  deleteSelectedItems() {
    // Delete edges first...
    for (const edge of this.selectedEdges) {
      this.deleteEdge(edge.id);
    }
    // ...then delete nodes.
    for (const node of this.selectedNodes) {
      this.deleteNode(node.id);
    }
  }

  removeSemiEdge() {
    const { semiEdge } = this;
    if (semiEdge instanceof FlowViewEdge) {
      semiEdge.remove();
    }
    this.semiEdge = undefined;
  }

  removeSelector() {
    const { selector } = this;
    if (selector instanceof FlowViewSelector) {
      selector.remove();
    }
    this.selector = undefined;
  }

  undo() {
    // TODO
  }

  redo() {
    // TODO
  }
}
