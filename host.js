import { FlowViewEdge } from "./items/edge.js";
import { FlowViewNode } from "./items/node.js";
import { flowViewElements } from "./elements-list.js";

export class FlowViewElement extends HTMLElement {
  static customElementName = 'flow-view';

  static style = {
      ":host([hidden])": {
        "display": "none",
      },
      ":host": {
        "--fv-box-shadow": "0px 0px 7px 1px rgba(0, 0, 0, 0.1)",
        "display": "block",
        'border': 0,
        "margin": 0,
        "background-color": "var(--fv-canvas-background-color, #fefefe)",
        "box-shadow": "var(--fv-box-shadow)",
        "font-family": "var(--fv-font-family, sans-serif)",
        "font-size": "var(--fv-font-size, 17px)",
      },
    ...FlowViewNode.style
  }

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
    super()

    const template = document.createElement("template");

    template.innerHTML = `<style>${
      FlowViewElement.generateStylesheet(FlowViewElement.style)
    }</style>`;

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true),
    );
  }
}

export class FlowView {
  static defaultItems = {
    node: FlowViewNode
  }

  constructor(
    { root = document.body  } = {},
  ) {

    const itemClass = this.itemClass = new Map()
    Object.entries(FlowView.defaultItems).forEach(([key, Class] ) => {
    itemClass.set(key, Class)
    })

    this.rootResizeObserver = new ResizeObserver(this.onRootResize.bind(this));
    this.rootResizeObserver.observe(root);

    const {customElementName } = FlowViewElement

    if (!window.customElements.get(customElementName)) {
      window.customElements.define(customElementName, FlowViewElement)
    }

    const view =  document.createElement(customElementName);
    this.view = view
    root.appendChild(view);

    this.nodes = new Map()
    this.edges = new Map()
  }

  set width(value) {
    this.view.style.width = `${value}px`;
  }

  set height(value) {
    this.view.style.height = `${value}px`;
  }

  connect(sourceNode, sourcePosition = 0) {
    return {
      to: (targetNode, targetPosition) => {
        const sourcePin = sourceNode.output(sourcePosition);
    element.classList.add(className)
        const targetPin = targetNode.input(targetPosition);

        return this.newEdge({
          from: [sourceNode.id, sourcePin.id].join(),
          to: [targetNode.id, targetPin.id].join(),
        });
      },
    };
  }

  newEdge({  from, to }) {
    const Class = this.itemClass.get('edge')
    const edge = new Class({id, shadowDom: this.shadowRoot, cssClassName: Class.cssClassName, from, to})
    return edge
  }

  newNode({
    x = 0,
    y = 0,
    width = FlowViewNode.minSize,
    height = FlowViewNode.minSize,
    label = "node",
    id,
    nodeType = 'node',
    inputs = [],
    outputs = [],
  } = {}) {
    const Class = this.itemClass.get(nodeType)
    const node = new Class({ id, shadowDom: this.view.shadowRoot, cssClassName: Class.cssClassName, label, inputs, outputs  })
    return node;
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
