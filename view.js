import { cssTheme, cssVar } from "./theme.js";
import { FlowViewEdge } from "../items/edge.js";
import { FlowViewNode } from "../items/node.js";
import { FlowViewPin } from "../items/pin.js";

export class FlowViewElement extends HTMLElement {
  static customElementName = "flow-view";
  static minHeight = 200;

  static style = {
    ":host([hidden])": {
      "display": "none",
    },
    ":host": {
      ...cssTheme,
      "position": "relative",
      "display": "block",
      "overflow": "hidden",
      "border": 0,
      "margin": 0,
      "background-color": cssVar.backgroundColor,
      "box-shadow": cssVar.boxShadow,
      "font-family": cssVar.fontFamily,
      "font-size": cssVar.fontSize,
      "color": cssVar.textColor,
    },
    ...FlowViewEdge.style,
    ...FlowViewNode.style,
    ...FlowViewPin.style,
  };

  static generateStylesheet(style) {
    return Object.entries(style).reduce((stylesheet, [selector, rules]) => (
      [
        stylesheet,
        `${selector} {`,
        Object.entries(rules).map(
          ([key, value]) => `  ${key}: ${value};`,
        ).join("\n"),
        "}",
      ].join("\n")
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

    template.innerHTML = `<style>${
      FlowViewElement.generateStylesheet(FlowViewElement.style)
    }</style>`;

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true),
    );

    this._origin = { x: 0, y: 0 };

    this._nodes = new Map();
    this._edges = new Map();
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
    this.removeEventListener("pointerdown", this.onPointerdown);
    this.removeEventListener("pointermove", this.onPointermove);
    this.removeEventListener("pointerleave", this.onPointerleave);
    this.removeEventListener("pointerup", this.onPointerup);
  }

  get canResize() {
    return "ResizeObserver" in window;
  }

  get origin() {
    if (this.translateVector) {
      return {
        x: this._origin.x + this.translateVector.x,
        y: this._origin.y + this.translateVector.y,
      };
    } else {
      return this._origin;
    }
  }

  get edges() {
    return Array.from(this._edges.values());
  }

  get nodes() {
    return Array.from(this._nodes.values());
  }

  set width(value) {
    this.style.width = `${value}px`;
  }

  set height(value) {
    this.style.height = `${value}px`;
  }

  addEdge(edge) {
    this._edges.set(edge.id, edge);
  }

  addNode(node) {
    this._nodes.set(node.id, node);
  }

  deleteEdge(id) {
    const edge = this.edges.get(id);
    // Dispose.
    edge.remove();
    this._edges.delete(id);
  }

  deleteNode(id) {
    const node = this._nodes.get(id);
    // Remove edges connected to node.
    for (const edge of this.edges) {
      if (edge.sourceNodeId === id || edge.targetNodeId === id) {
        this.deleteEdge(edge.id);
      }
    }
    // Dispose.
    node.remove();
    this._nodes.delete(id);
  }

  edge (id) {
    return this._edges.get(id)
  }

  node (id) {
    return this._nodes.get(id)
  }

  startTranslate(event) {
    this.startDraggingPoint = FlowViewElement.pointerCoordinates(event);
    this.translateVector = { x: 0, y: 0 };
  }

  stopTranslate() {
    if (this.translateVector) {
      this._origin = {
        x: this._origin.x + this.translateVector.x,
        y: this._origin.y + this.translateVector.y,
      };
      this.translateVector = undefined;
    }

    this.startDraggingPoint = undefined;
  }

  onPointerdown(event) {
    this.startTranslate(event);
  }

  onPointermove(event) {
    const { startDraggingPoint } = this;

    if (startDraggingPoint) {
      const pointerPosition = FlowViewElement.pointerCoordinates(event);

      this.translateVector = {
        x: startDraggingPoint.x - pointerPosition.x,
        y: startDraggingPoint.y - pointerPosition.y,
      };

      for (const node of this.nodes.values()) {
        node.onViewOriginUpdate();
      }
    }
  }

  onPointerleave() {
    this.stopTranslate();
  }

  onPointerup() {
    this.stopTranslate();
  }

  onRootResize(entries) {
    for (const entry of entries) {
      const contentBoxSize = Array.isArray(entry.contentBoxSize)
        ? entry.contentBoxSize[0]
        : entry.contentBoxSize;
      this.width = contentBoxSize.inlineSize;
      this.height = contentBoxSize.blockSize - 10;
    }
  }
}
