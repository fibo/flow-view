import { cssVar } from "../theme.js";
import { FlowViewBase } from "./base.js";

export class FlowViewPin extends FlowViewBase {
  static cssClassName = "fv-pin";
  static size = 10;

  static style = {
    [`.${FlowViewPin.cssClassName}`]: {
      "background-color": cssVar.connectionColor,
      "border-radius": cssVar.borderRadius,
      "display": "block",
      "width": `${FlowViewPin.size}px`,
      "height": `${FlowViewPin.size}px`,
    },
    [`.${FlowViewPin.cssClassName}:hover`]: {
      "background-color": cssVar.connectionColorHighlighted,
    },
  };

  init({ node }) {
    this.node = node;

    this._onPointerdown = this.onPointerdown.bind(this);
    this.element.addEventListener("pointerdown", this._onPointerdown);
  }

  get halfPinSize() {
    return Math.round(FlowViewPin.size / 2);
  }

  dispose() {
    this.element.removeEventListener("pointerdown", this._onPointerdown);
  }

  onPointerdown(event) {
    event.stopPropagation();
  }
}
