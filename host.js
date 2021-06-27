import { FlowViewCanvas } from "./elements/canvas.js";
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

  newNode(
    {
      position = [100, 100],
      dimension = [100, 40],
      label = "",
      inputs = [],
      outputs = [],
    } = {},
  ) {
    const node = document.createElement(FlowViewNode.customElementName);
    node.setAttribute("x", position[0]);
    node.setAttribute("y", position[1]);
    node.setAttribute("width", dimension[0]);
    node.setAttribute("height", dimension[1]);
    node.setAttribute("label", label);

    this.canvas.appendChild(node);

    for (const pin of inputs) {
      node.addInput(pin);
    }

    for (const pin of outputs) {
      node.addOutput(pin);
    }
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
