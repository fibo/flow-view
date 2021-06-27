import { FlowViewItem } from "./item.js";

export const pinSize = 10;

export class FlowViewPin extends FlowViewItem {
  static customElementName = FlowViewItem.elementName.pin;
  static size = 10;

  constructor() {
    super({
      ":host": {
        "background-color": "var(--fv-connection-color)",
        "display": "block",
        "width": `${FlowViewPin.size}px`,
        "height": `${FlowViewPin.size}px`,
      },
      ":host(:hover)": {
        "background-color": "var(--fv-highlighted-connection-color)",
      },
    });
  }

  static get observedAttributes() {
    return FlowViewItem.observedAttributes;
  }

  static centerOfPin(pin) {
    const node = FlowViewPin.nodeOfPin(pin);

    const halfPinSize = Math.round(FlowViewPin.size / 2);

    if (node) {
      const x = Number(node.getAttribute("x"));
      const y = Number(node.getAttribute("y"));

      const nodeBorderWidth = 1;

      if (FlowViewPin.isInput(pin)) {
        return {
          x: x + halfPinSize,
          y: y + halfPinSize,
        };
      }

      if (FlowViewPin.isOutput(pin)) {
        const height = Number(node.getAttribute("height"));

        return {
          y: y + height - halfPinSize - nodeBorderWidth,
          x: x + halfPinSize + nodeBorderWidth,
        };
      }
    }
  }

  static isInput(pin) {
    const { parentNode } = pin;

    if (parentNode && parentNode.tagName === "DIV") {
      return parentNode.slot === "inputs";
    }

    return false;
  }

  static isOutput(pin) {
    const { parentNode } = pin;

    if (parentNode && parentNode.tagName === "DIV") {
      return parentNode.slot === "outputs";
    }

    return false;
  }

  static nodeOfPin(pin) {
    const { parentNode } = pin;

    if (
      parentNode && parentNode.tagName === "DIV" && (
        ["inputs", "outputs"].includes(parentNode.slot)
      )
    ) {
      const grandParentNode = parentNode.parentNode;

      if (
        grandParentNode.tagName === FlowViewItem.elementName.node.toUpperCase()
      ) {
        return grandParentNode;
      }
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

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
    super.connectedCallback();

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
    super.disconnectedCallback();

    const { node } = this;

    if (node) {
      this.removeEventListener("pointerdown", this.onpointerdown);
    }
  }

  onpointerdown(event) {
    event.stopPropagation();
  }

  get node() {
    return FlowViewPin.nodeOfPin(this);
  }
}
