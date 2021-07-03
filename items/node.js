import { FlowViewBase } from "./base.js";
import { FlowViewPin } from "./pin.js";

export class FlowViewNode extends FlowViewBase {
  static cssClassName = "fv-node";
  static minSize = FlowViewPin.size * 4;

  static style = {
    [`.${FlowViewNode.cssClassName}`]: {
      "position": "absolute",
      "background-color": "var(--fv-node-background-color, #fefefe)",
      "box-shadow": "var(--fv-box-shadow)",
      "display": "flex",
      "flex-direction": "column",
      "justify-content": "space-between",
      "border": "1px solid transparent",
      "min-height": `${FlowViewNode.minSize}px`,
      "min-width": `${FlowViewNode.minSize}px`,
      "width": "fit-content",
    },
    [`.${FlowViewNode.cssClassName} .label`]: {
      "user-select": "none",
      "padding-left": "0.5em",
      "padding-right": "0.5em",
    },
    [`.${FlowViewNode.cssClassName} .pins`]: {
      "display": "flex",
      "flex-direction": "row",
      "justify-content": "space-between",
      "height": `${FlowViewPin.size}px`,
    },
  };

  init({ label, inputs = [], outputs = [], x, y, view }) {
    this.view = view;

    this.inputs = new Map();
    this.inputListElement = this.createDiv("pins");
    for (const pin of inputs) {
      this.newInput(pin);
    }

    this.labelElement = this.createDiv("label");
    this.label = label;

    this.outputs = new Map();
    this.outputListElement = this.createDiv("pins");
    for (const pin of outputs) {
      this.newOutput(pin);
    }

    this.position = { x, y };
  }

  get label() {
    return this.labelElement.textContent;
  }

  set label(value) {
    this.labelElement.textContent = value;
  }

  get position() {
    return { x: this.x, y: this.y };
  }

  set position({ x = 0, y = 0 } = {}) {
    const { element, view } = this;

    this.x = x;
    this.y = y;
    element.style.top = `${y - view.origin.y}px`;
    element.style.left = `${x - view.origin.x}px`;
  }

  onViewOriginUpdate() {
    // Just trigger position setter.
    const { x, y } = this.position;
    this.position = { x, y };
  }

  newInput({ id }) {
    const pin = new FlowViewPin({
      id,
      shadowDom: this.shadowDom,
      cssClassName: FlowViewPin.cssClassName,
    });
    this.inputs.set(pin.id, pin);
    this.inputListElement.appendChild(pin.element);
  }

  newOutput({ id }) {
    const pin = new FlowViewPin({
      id,
      shadowDom: this.shadowDom,
      cssClassName: FlowViewPin.cssClassName,
    });
    this.outputs.set(pin.id, pin);
    this.outputListElement.appendChild(pin.element);
  }
}
