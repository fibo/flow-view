import { FlowViewPin } from "./pin.js";
import { FlowViewItem } from "./item.js";

export class FlowViewLink extends FlowViewItem {
  static customElementName = FlowViewItem.elementName.link;
  static width = 2;

  constructor() {
    super(
      {
        ":host": {
          "display": "inline-block",
          "position": "absolute",
          "border": "1px solid transparent",
        },
        line: {
          "stroke": "var(--fv-connection-color)",
          "stroke-width": FlowViewLink.width,
        },
        "line:hover": {
          "stroke": "var(--fv-highlighted-connection-color)",
        },
      },
      "<slot><svg><line></line></svg></slot>",
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
    const { canvas } = this;

    if (oldValue === newValue) return;

    super.attributeChangedCallback(name, oldValue, newValue);

    switch (name) {
      case "from": {
        const [nodeId, pinId] = newValue.split(",");
        const node = canvas.getItemById(nodeId);
        this.sourceNode = node;
        this.sourcePin = node.getOutputById(pinId);
        break;
      }

      case "to": {
        const [nodeId, pinId] = newValue.split(",");
        const node = canvas.getItemById(nodeId);
        this.targetNode = node;
        this.targetPin = node.getInputById(pinId);
        break;
      }
    }

    if (["from", "to"].includes(name)) {
      this.updateGeometry();
    }
  }

  set dimension([width, height]) {
    const { style, svg } = this;

    style.width = `${width}px`;
    style.height = `${height}px`;

    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
  }

  get line() {
    return this.shadowRoot.querySelector("line");
  }

  set position([x, y]) {
    this.style.top = `${y}px`;
    this.style.left = `${x}px`;
  }

  get svg() {
    return this.shadowRoot.querySelector("svg");
  }

  updateGeometry() {
    const { line, sourceNode, sourcePin, targetNode, targetPin } = this;

    if (
      [sourceNode, sourcePin, targetNode, targetPin].some((element) => !element)
    ) {
      this.position = [0, 0];
      this.dimension = [0, 0];
      return;
    }

    const sourcePosition = FlowViewPin.centerOfPin(sourceNode, "output");
    const targetPosition = FlowViewPin.centerOfPin(targetNode, "input");

    const invertedX = targetPosition.x < sourcePosition.x;
    const invertedY = targetPosition.y < sourcePosition.y;

    const x = invertedX ? targetPosition.x : sourcePosition.x;
    const y = invertedY ? targetPosition.y : sourcePosition.y;
    this.position = [x, y];

    const width = Math.abs(targetPosition.x - sourcePosition.x);
    const height = Math.abs(targetPosition.y - sourcePosition.y);
    this.dimension = [width, height];

    const x1 = invertedX ? width : 0;
    const y1 = invertedY ? height : 0;
    const x2 = invertedX ? 0 : width;
    const y2 = invertedY ? 0 : height;
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
  }
}
