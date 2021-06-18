import { FlowViewItem } from './item.js'

export const pinSize = 10;

export function isInput(pin) {
  const { parentNode } = pin;

  if (parentNode && parentNode.tagName === "DIV") {
    return parentNode.slot === "inputs";
  }

  return false;
}

export function isOutput(pin) {
  const { parentNode } = pin;

  if (parentNode && parentNode.tagName === "DIV") {
    return parentNode.slot === "outputs";
  }

  return false;
}

export function centerOfPin(pin) {
  const node = nodeOfPin(pin);

  const halfPinSize = Math.round(pinSize / 2);

  if (node) {
    const x = Number(node.getAttribute("x"));
    const y = Number(node.getAttribute("y"));

    const nodeBorderWidth = 1;

    if (isInput(pin)) {
      return {
        x: x + halfPinSize,
        y: y + halfPinSize,
      };
    }

    if (isOutput(pin)) {
      const height = Number(node.getAttribute("height"));

      return {
        y: y + height - halfPinSize - nodeBorderWidth,
        x: x + halfPinSize + nodeBorderWidth,
      };
    }
  }
}

export function nodeOfPin(pin) {
  const { parentNode } = pin;

  if (
    parentNode && parentNode.tagName === "DIV" && (
      ["inputs", "outputs"].includes(parentNode.slot)
    )
  ) {
    const grandParentNode = parentNode.parentNode;

    if (grandParentNode.tagName === "FV-NODE") {
      return grandParentNode;
    }
  }
}

export class FlowViewPin extends HTMLElement {
  static customElementName = "fv-pin";

  constructor() {
    super();

    const template = document.createElement("template");
    template.innerHTML =
      `<style> :host { background-color: var(--fv-pin-background-color, #dbdbdb); display: block; width: ${pinSize}px; height: ${pinSize}px; } </style> <slot></slot>`;

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true),
    );
  }

  static get observedAttributes() {
    return [
      "id",
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
    }
  }

  connectedCallback() {
    const { node } = this;

    if (node) {
      this.addEventListener("pointerdown", this.onpointerdown);

      // Set a readonly id, prefixed by node id.
      const idPrefix = node.id;
      const id = this.id || FlowViewItem.generateId(idPrefix);
      Object.defineProperty(this, "_id", { value: id, writable: false });
      this.setAttribute("id", id);
    }
  }

  disconnectedCallback() {
    const { node } = this;

    if (node) {
      this.removeEventListener("pointerdown", this.onpointerdown);
    }
  }

  onpointerdown(event) {
    event.stopPropagation();
  }

  get node() {
    return nodeOfPin(this);
  }
}
