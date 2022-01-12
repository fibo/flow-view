import { cssModifierHighlighted, cssTransition, cssVar } from "../theme.js";
import { FlowViewBase } from "./base.js";

export class FlowViewPin extends FlowViewBase {
  static cssClassName = "fv-pin";
  static size = 10;

  static style = {
    [`.${FlowViewPin.cssClassName}`]: {
      "background-color": cssVar.connectionColor,
      "cursor": "none",
      "position": "relative",
      "display": "block",
      "width": `${FlowViewPin.size}px`,
      "height": `${FlowViewPin.size}px`,
      ...cssTransition("background-color"),
    },
    [`.${FlowViewPin.cssClassName} .info`]: {
      "visibility": "hidden",
      "position": "absolute",
      "background-color": "transparent",
      "user-select": "none",
    },
    [`.${FlowViewPin.cssClassName}:hover .info`]: {
      "visibility": "visible",
    },
    [`.${cssModifierHighlighted(FlowViewPin.cssClassName)}`]: {
      "background-color": cssVar.connectionColorHighlighted,
    },
  };

  init({ name, node }) {
    this.name = name;
    this.node = node;

    this.info = this.createDiv("info");
    this.text = name || "";

    this._onPointerdown = this.onPointerdown.bind(this);
    this.element.addEventListener("pointerdown", this._onPointerdown);
    this._onPointerenter = this.onPointerenter.bind(this);
    this.element.addEventListener("pointerenter", this._onPointerenter);
    this._onPointerleave = this.onPointerleave.bind(this);
    this.element.addEventListener("pointerleave", this._onPointerleave);
    this._onPointerup = this.onPointerup.bind(this);
    this.element.addEventListener("pointerup", this._onPointerup);
  }

  set text(value) {
    this.info.innerHTML = value;
  }

  get halfPinSize() {
    return Math.round(FlowViewPin.size / 2);
  }

  dispose() {
    this.element.removeEventListener("pointerdown", this._onPointerdown);
    this.element.removeEventListener("pointerenter", this._onPointerenter);
    this.element.removeEventListener("pointerleave", this._onPointerleave);
    this.element.removeEventListener("pointerup", this._onPointerup);
  }

  onPointerleave(event) {
    event.stopPropagation();
    this.highlight = false;
  }

  toObject() {
    const { name } = this;
    const obj = {};
    if (typeof name !== "undefined") {
      obj.name = name;
    }
    return {
      ...super.toObject(),
      ...obj,
    };
  }
}
