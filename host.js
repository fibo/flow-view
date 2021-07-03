import { FlowViewEdge } from "./items/edge.js";
import { FlowViewNode } from "./items/node.js";
import { FlowViewPin } from "./items/pin.js";

export class FlowViewElement extends HTMLElement {
  static customElementName = "flow-view";
  static minHeight = 200;

  static style = {
    ":host([hidden])": {
      "display": "none",
    },
    ":host": {
      "--fv-box-shadow": "0px 0px 7px 1px rgba(0, 0, 0, 0.1)",
      "--fv-connection-color": "#ccc",
      "position": "relative",
      "display": "block",
      "overflow": "hidden",
      "border": 0,
      "margin": 0,
      "background-color": "var(--fv-canvas-background-color, #fefefe)",
      "box-shadow": "var(--fv-box-shadow)",
      "font-family": "var(--fv-font-family, sans-serif)",
      "font-size": "var(--fv-font-size, 17px)",
      "color": "var(--fv-text-color, #111)",
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

  constructor() {
    super();

    const template = document.createElement("template");

    template.innerHTML = `<style>${
      FlowViewElement.generateStylesheet(FlowViewElement.style)
    }</style>`;

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true),
    );
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
  }

  disconnectedCallback() {
    // Remove eventListeners
  }

  get canResize() {
    return "ResizeObserver" in window;
  }

  set width(value) {
    this.style.width = `${value}px`;
  }

  set height(value) {
    this.style.height = `${value}px`;
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

    this.nodes = new Map();
    this.edges = new Map();
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
    });
    return node;
  }
}
