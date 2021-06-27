import { FlowViewPin } from "./pin.js";
import { FlowViewItem } from "./item.js";

export class FlowViewLink extends FlowViewItem {
  static customElementName = "fv-link";

  constructor() {
    super(
      {
        ":host": {
          "display": "inline-block",
          "position": "absolute",
          "border": "1px solid transparent",
        },
        ":host(:hover)": { "border-color": "var(--fv-shadow-color)" },
        line: { "stroke": "black", "stroke-width": 1 },
      },
      '<slot><svg><line  x1="0" y1="0" x2="200" y2="200"></line></svg></slot>',
    );
  }

  static get observedAttributes() {
    return FlowViewItem.observedAttributes.concat(
      [
        "from",
        "to",
      ],
    );
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
    const { style, svg } = this;

    style.width = `${width}px`;
    style.height = `${height}px`;

    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
  }

  set position([x, y]) {
    this.style.top = `${y}px`;
    this.style.left = `${x}px`;
  }

  get svg() {
    return this.shadowRoot.querySelector("svg");
  }

  updateGeometry() {
    const { sourcePin, targetPin } = this;

    if (!(sourcePin && targetPin)) {
      this.position = [0, 0];
      this.dimension = [0, 0];
      return;
    }

    const sourcePosition = FlowViewPin.centerOfPin(sourcePin);
    const targetPosition = FlowViewPin.centerOfPin(targetPin);

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
