import { centerOfPin } from "./pin.js";
import { FlowViewItem } from "./item.js";

export class FlowViewLink extends FlowViewItem {
  static customElementName = "fv-link";

  constructor() {
    super();

    const template = document.createElement("template");
    template.innerHTML =
      `<style> :host { display: inline-block; position: absolute; border: 1px solid transparent; } :host(:hover) { border-color: var(--fv-shadow-color); } </style> <slot></slot>`;

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true),
    );
  }

  static get observedAttributes() {
    return [
      "id",
      "from",
      "to",
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    super.attributeChangedCallback(name, oldValue, newValue);

    switch (name) {
      case "from": {
        this.sourcePin = document.getElementById(newValue);
        break;
      }

      case "to": {
        this.targetPin = document.getElementById(newValue);
        break;
      }
    }

    if (["from", "to"].includes(name)) {
      this.updateGeometry();
    }
  }

  get canvas() {
    const { parentNode } = this;

    if (parentNode && parentNode.tagName === "FV-CANVAS") {
      return parentNode;
    } else {
      return null;
    }
  }

  set dimension([width, height]) {
    this.style.width = `${width}px`;
    this.style.height = `${height}px`;
  }

  set position([x, y]) {
    this.style.top = `${y}px`;
    this.style.left = `${x}px`;
  }

  updateGeometry() {
    const { sourcePin, targetPin } = this;

    if (!(sourcePin && targetPin)) {
      this.position = [0, 0];
      this.dimension = [0, 0];
      return;
    }

    const sourcePosition = centerOfPin(sourcePin);
    const targetPosition = centerOfPin(targetPin);

    const invertedX = targetPosition.x < sourcePosition.x;
    const invertedY = targetPosition.y < sourcePosition.y;

    const x = invertedX ? targetPosition.x : sourcePosition.x;
    const y = invertedY ? targetPosition.y : sourcePosition.y;
    this.position = [x, y];

    const width = Math.abs(targetPosition.x - sourcePosition.x);
    const height = Math.abs(targetPosition.y - sourcePosition.y);
    this.dimension = [width, height];
  }
}
