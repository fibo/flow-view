import { FlowViewCanvas } from "./elements/canvas.js";
import { FlowViewLink } from "./elements/link.js";
import { FlowViewNode } from "./elements/node.js";
import { flowViewInit } from "./init.js";
import { flowViewElements } from "./elements-list.js";

export class FlowView {
  constructor(
    { root = document.body, customElements = flowViewElements } = {},
  ) {
    const container = this.container = document.createElement("div");

    container.style.boxSizing = "border-block";
    container.style.display = "inline-block";
    container.style.border = 0;
    container.style.margin = 0;

    const canvas = this.canvas = document.createElement(
      FlowViewCanvas.customElementName,
    );
    container.appendChild(canvas);

    this.rootResizeObserver = new ResizeObserver(this.onRootResize.bind(this));
    this.rootResizeObserver.observe(root);

    root.appendChild(container);

    flowViewInit(customElements);
  }

  set width(value) {
    this.container.style.width = `${value}px`;
  }

  set height(value) {
    this.container.style.height = `${value}px`;
  }

  connect(sourceNode, sourcePosition = 0) {
    return {
      to: (targetNode, targetPosition) => {
        const sourcePin = sourceNode.output(sourcePosition);
        const targetPin = targetNode.input(targetPosition);

        return this.newLink({
          from: [sourceNode.id, sourcePin.id].join(),
          to: [targetNode.id, targetPin.id].join(),
        });
      },
    };
  }

  newLink({ from, to }) {
    const link = document.createElement(FlowViewLink.customElementName);
    this.canvas.appendChild(link);
    link.setAttribute("from", from);
    link.setAttribute("to", to);
    return link;
  }

  newNode({
    x = 0,
    y = 0,
    width = FlowViewNode.minSize,
    height = FlowViewNode.minSize,
    label = "node",
    inputs = [],
    outputs = [],
  } = {}) {
    const node = document.createElement(FlowViewNode.customElementName);
    this.canvas.appendChild(node);
    node.setAttribute("x", x);
    node.setAttribute("y", y);
    node.setAttribute("width", width);
    node.setAttribute("height", height);
    node.setAttribute("label", label);

    for (const pin of inputs) {
      node.addInput(pin);
    }
    for (const pin of outputs) {
      node.addOutput(pin);
    }

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
