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

    switch (name) {
      // The `id` attribute cannot be changed.
      case "id": {
        if (oldValue !== null && newValue !== this._id) {
          this.setAttribute("id", this._id);
        }
        break;
      }

      case "from":
      case "to": {
        const sourcePin = document.getElementById(
          name === "from" ? newValue : this.getAttribute("from"),
        );
        const targetPin = document.getElementById(
          name === "to" ? newValue : this.getAttribute("to"),
        );

        const dimension = this.computeDimensions({ sourcePin, targetPin });

        if (dimension) {
          this.style.width = `${dimension.width}px`;
          this.style.height = `${dimension.height}px`;
        }

        const position = this.computePosition({ sourcePin });

        if (position) {
          this.style.top = `${position.y}px`;
          this.style.left = `${position.x}px`;
        }

        break;
      }
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

  computeDimensions({ sourcePin, targetPin }) {
    const sourcePosition = centerOfPin(sourcePin);
    const targetPosition = centerOfPin(targetPin);

    if (sourcePosition && targetPosition) {
      return {
        width: targetPosition.x - sourcePosition.x,
        height: targetPosition.y - sourcePosition.y,
      };
    }
  }

  computePosition({ sourcePin }) {
    return centerOfPin(sourcePin);
  }
}
