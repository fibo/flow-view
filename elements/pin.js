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
    return FlowViewItem.observedAttributes.concat(["name"]);
  }

  static centerOfPin(node, pinType) {
    const nodeBorderWidth = 1;
    const halfPinSize = Math.round(FlowViewPin.size / 2);

    if (node) {
      const x = Number(node.getAttribute("x"));
      const y = Number(node.getAttribute("y"));

      if (pinType === "input") {
        return {
          x: x + halfPinSize,
          y: y + halfPinSize,
        };
      }

      if (pinType === "output") {
        const height = Number(node.getAttribute("height"));

        return {
          y: y + height - halfPinSize - nodeBorderWidth,
          x: x + halfPinSize + nodeBorderWidth,
        };
      }
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    super.attributeChangedCallback(name, oldValue, newValue);

    switch (name) {
      case "name": {
        this.name = newValue;
        break;
      }
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
