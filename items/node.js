import { cssModifierHighlighted, cssTransition, cssVar } from "../theme.js";
import { FlowViewBase } from "./base.js";
import { FlowViewInput } from "./input.js";
import { FlowViewOutput } from "./output.js";
import { FlowViewEdge } from "./edge.js";
import { FlowViewPin } from "./pin.js";

export class FlowViewNode extends FlowViewBase {
  static cssClassName = "fv-node";
  static borderWidth = 1;
  static minSize = FlowViewPin.size * 4;
  static zIndex = FlowViewEdge.zIndex + 1;
  static style = {
    [`.${FlowViewNode.cssClassName}`]: {
      "position": "absolute",
      "background-color": cssVar.nodeBackgroundColor,
      "border-radius": cssVar.borderRadius,
      "box-shadow": cssVar.boxShadow,
      "display": "flex",
      "flex-direction": "column",
      "justify-content": "space-between",
      "border": `${FlowViewNode.borderWidth}px solid transparent`,
      "min-height": `${FlowViewNode.minSize}px`,
      "min-width": `${FlowViewNode.minSize}px`,
      "width": "fit-content",
      "z-index": FlowViewNode.zIndex,
      ...cssTransition("border-color"),
    },
    [`.${cssModifierHighlighted(FlowViewNode.cssClassName)}`]: {
      "border-color": cssVar.nodeBorderColorHighlighted,
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

  init({ label, inputs = [], outputs = [], x, y }) {
    const { element } = this;

    this.borderWidth = FlowViewNode.borderWidth;

    this._inputs = new Map();
    this.inputListDiv = this.createDiv("pins");
    for (const pin of inputs) {
      this.newInput(pin);
    }

    this.labelDiv = this.createDiv("label");
    this.label = label;

    this._outputs = new Map();
    this.outputListDiv = this.createDiv("pins");
    for (const pin of outputs) {
      this.newOutput(pin);
    }

    this.position = { x, y };

    this._onDblclick = this.onDblclick.bind(this);
    element.addEventListener("dblclick", this._onDblclick);
    this._onPointerdown = this.onPointerdown.bind(this);
    element.addEventListener("pointerdown", this._onPointerdown);
  }

  dispose() {
    const { element } = this;
    element.removeEventListener("dblclick", this._onDblclick);
    element.removeEventListener("pointerdown", this._onPointerdown);
  }

  get label() {
    return this.labelDiv.textContent;
  }

  set label(value) {
    this.labelDiv.textContent = value;
  }

  get inputs() {
    return Array.from(this._inputs.values());
  }

  get outputs() {
    return Array.from(this._outputs.values());
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

  deleteInput(id) {
    const input = this._inputs.get(id);
    input.remove();
    this._inputs.delete(id);
  }

  deleteOutput(id) {
    const output = this._outputs.get(id);
    output.remove();
    this._outputs.delete(id);
  }

  input(id) {
    return this._inputs.get(id);
  }

  output(id) {
    return this._outputs.get(id);
  }

  newInput({ id, name, types }) {
    const pin = new FlowViewInput({
      id,
      name,
      node: this,
      types,
      view: this.view,
      cssClassName: FlowViewPin.cssClassName,
    });
    this._inputs.set(pin.id, pin);
    this.inputListDiv.appendChild(pin.element);
  }

  newOutput({ id, name, types }) {
    const pin = new FlowViewOutput({
      id,
      name,
      node: this,
      types,
      view: this.view,
      cssClassName: FlowViewPin.cssClassName,
    });
    this._outputs.set(pin.id, pin);
    this.outputListDiv.appendChild(pin.element);
  }

  onDblclick(event) {
    event.stopPropagation();
  }

  onPointerdown(event) {
    if (event.isBubblingFromPin) return;

    event.isBubblingFromNode = true;
    const isMultiSelection = event.shiftKey ||
      (this.view.hasSelectedNodes && this.isSelected);
    if (!isMultiSelection) {
      this.view.clearSelection();
    }
    this.view.selectNode(this);
  }

  toObject() {
    const { label, inputs, outputs } = this;
    return {
      ...super.toObject(),
      label,
      inputs: inputs.map((pin) => pin.toObject()),
      outputs: outputs.map((pin) => pin.toObject()),
    };
  }
}
