import { cssVar } from "../theme.js";
import { FlowViewBase } from "./base.js";
import { FlowViewNode } from "./node.js";

export class FlowViewSelector extends FlowViewBase {
  static cssClassName = "fv-selector";
  static zIndex = FlowViewNode.zIndex + 1;
  static style = {
    [`.${FlowViewSelector.cssClassName}`]: {
      "position": "absolute",
      "box-shadow": cssVar.boxShadow,
    },
    [`.${FlowViewSelector.cssClassName} input`]: {
      "border": 0,
      "margin": 0,
      "outline": 0,
      "border-radius": cssVar.borderRadius,
      "font-family": cssVar.fontFamily,
      "font-size": cssVar.fontSize,
      "padding": "0.5em",
      "z-index": FlowViewSelector.zIndex,
    },
  };

  init({ position }) {
    const { element } = this;

    element.setAttribute("tabindex", 0);

    const input = this.input = document.createElement("input");
    element.appendChild(input);

    this.position = position;

    this._onDblclick = this.onDblclick.bind(this);
    element.addEventListener("dblclick", this._onDblclick);
    this._onKeydown = this.onKeydown.bind(this);
    element.addEventListener("keydown", this._onKeydown);
    this._onPointerdown = this.onPointerdown.bind(this);
    element.addEventListener("pointerdown", this._onPointerdown);
  }

  dispose() {
    const { element } = this;
    element.removeEventListener("dblclick", this._onDblclick);
    element.removeEventListener("keydown", this._onKeydown);
    element.removeEventListener("pointerdown", this._onPointerdown);
  }

  focus() {
    this.input.focus();
  }

  set position({ x, y }) {
    const { element, view } = this;
    element.style.top = `${y - view.origin.y}px`;
    element.style.left = `${x - view.origin.x}px`;
    this.x = x;
    this.y = y;
  }

  get position() {
    return { x: this.x, y: this.y };
  }

  onDblclick(event) {
    event.stopPropagation();
  }

  onKeydown(event) {
    event.stopPropagation();

    switch (true) {
      case event.code === "Enter": {
        const { x, y } = this.position;
        this.view.newNode({
          x,
          y,
          label: this.input.value,
        });
        this.view.removeSelector();
        break;
      }
      case event.code === "Escape": {
        this.view.removeSelector();
        break;
      }
      case event.code === "Tab": {
        event.preventDefault();
        break;
      }
      default: {
        // console.log(event.code);
      }
    }
  }

  onPointerdown(event) {
    event.stopPropagation();
  }
}
