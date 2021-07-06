import { cssVar } from "../theme.js";
import { FlowViewBase } from "./base.js";

export class FlowViewSelector extends FlowViewBase {
  static cssClassName = "fv-selector";
  static style = {
    [`.${FlowViewSelector.cssClassName}`]: {
      "position": "absolute",
      "box-shadow": cssVar.boxShadow,
    },
    [`.${FlowViewSelector.cssClassName} input`]: {
      "border": 0,
    },
  };

  init({ position }) {
    this.element.setAttribute("tabindex", 0);

    const input = this.input = document.createElement("input");
    this.element.appendChild(input);

    this.position = position;

    this._onKeydown = this.onKeydown.bind(this);
    this.element.addEventListener("keydown", this._onKeydown);
  }

  dispose() {
    this.element.removeEventListener("keydown", this._onKeydown);
  }

  focus() {
    this.input.focus();
  }

  set position({ x, y }) {
    const { element, view } = this;
    element.style.top = `${y - view.origin.y}px`;
    element.style.left = `${x - view.origin.x}px`;
  }

  onKeydown(event) {
    event.stopPropagation();

    switch (true) {
      case event.code === "Tab": {
        event.preventDefault();
        break;
      }
      default: {
        // console.log(event.code);
      }
    }
  }
}
