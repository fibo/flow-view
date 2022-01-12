import { cssVar } from "../theme.js";
import { FlowViewBase } from "./base.js";
import { FlowViewNode } from "./node.js";

export class FlowViewSelector extends FlowViewBase {
  static cssClassName = "fv-selector";
  static zIndex = FlowViewNode.zIndex + 1;
  static width = 216;
  static padding = 9;
  static style = {
    [`.${FlowViewSelector.cssClassName}`]: {
      "position": "absolute",
      "box-shadow": cssVar.boxShadow,
      "z-index": FlowViewSelector.zIndex,
    },
    [`.${FlowViewSelector.cssClassName} input`]: {
      "border": 0,
      "margin": 0,
      "outline": 0,
      "border-radius": cssVar.borderRadius,
      "font-family": cssVar.fontFamily,
      "font-size": cssVar.fontSize,
      "padding": `${FlowViewSelector.padding}px`,
      "width": `${FlowViewSelector.width - 2 * FlowViewSelector.padding}px`,
    },
    [`.${FlowViewSelector.cssClassName}__hint`]: {
      "position": "absolute",
      "left": "0",
      "background": "transparent",
      "pointer-events": "none",
    },
    [`.${FlowViewSelector.cssClassName}__hint::placeholder`]: {
      "opacity": "0.4",
    },
  };

  init({ nodeLabels, position }) {
    const { element } = this;

    element.setAttribute("tabindex", 0);

    const hint = this.hint = document.createElement("input");
    hint.classList.add(`${FlowViewSelector.cssClassName}__hint`);
    element.appendChild(hint);

    const input = this.input = document.createElement("input");
    element.appendChild(input);

    this.nodeLabels = nodeLabels;
    this.position = position;

    this._onDblclick = this.onDblclick.bind(this);
    element.addEventListener("dblclick", this._onDblclick);
    this._onPointerdown = this.onPointerdown.bind(this);
    element.addEventListener("pointerdown", this._onPointerdown);

    this._onKeydown = this.onKeydown.bind(this);
    input.addEventListener("keydown", this._onKeydown);
    this._onKeyup = this.onKeyup.bind(this);
    input.addEventListener("keyup", this._onKeyup);
  }

  dispose() {
    const { element, input } = this;

    element.removeEventListener("dblclick", this._onDblclick);
    element.removeEventListener("pointerdown", this._onPointerdown);

    input.removeEventListener("keydown", this._onKeydown);
    input.removeEventListener("keyup", this._onKeyup);
  }

  focus() {
    this.input.focus();
  }

  get completion() {
    return this.hint.getAttribute("placeholder");
  }

  set completion(text) {
    this.hint.setAttribute("placeholder", text);
  }

  get matchingNodeLabels() {
    const { input: { value } } = this;

    // Type at least few chars to start showing completion.
    if (value.length < 2) return [];

    return this.nodeLabels.filter((label) => (
      // input value fits into node label...
      label.startsWith(value) &&
      // ...but they are not the same yet.
      // Otherwise if a label starts with another label,
      // some completions could be missed.
      label !== value
    ));
  }

  set position({ x, y }) {
    const { element, view } = this;

    // Avoid overflow, using some heuristic values.
    const overflowY = y - view.origin.y + 40 >= view.height;
    const overflowX = x - view.origin.x + FlowViewSelector.width >= view.width;
    const _x = overflowX
      ? view.width + view.origin.x - FlowViewSelector.width - 10
      : x;
    const _y = overflowY ? view.height + view.origin.y - 50 : y;

    element.style.top = `${_y - view.origin.y}px`;
    element.style.left = `${_x - view.origin.x}px`;

    this.x = _x;
    this.y = _y;
  }

  get position() {
    return { x: this.x, y: this.y };
  }

  createNode() {
    const {
      input: { value },
      position: { x, y },
      view,
    } = this;

    view.newNode({ x, y, label: value });
    view.removeSelector();
  }

  onDblclick(event) {
    event.stopPropagation();
  }

  onKeydown(event) {
    event.stopPropagation();

    switch (true) {
      case event.code === "Enter": {
        this.createNode();
        break;
      }

      case event.code === "Escape": {
        this.view.removeSelector();
        break;
      }

      case event.code === "Tab": {
        event.preventDefault();
        const { completion } = this;
        if (completion) {
          this.input.value = completion;
        }
        break;
      }

      default: {
        // console.log(event.code);
      }
    }
  }

  onKeyup(event) {
    event.stopPropagation();

    const { input: { value }, matchingNodeLabels } = this;

    switch (matchingNodeLabels.length) {
      case 0: {
        this.completion = "";
        break;
      }
      case 1: {
        this.completion = matchingNodeLabels[0];
        break;
      }
      default: {
        let completion = value;

        const shortestMatch = matchingNodeLabels.reduce((
          shortest,
          match,
        ) => (shortest.length < match.length ? shortest : match));

        for (let i = value.length; i < shortestMatch.length; i++) {
          const currentChar = shortestMatch[i];

          if (
            matchingNodeLabels.every((label) =>
              label.startsWith(completion + currentChar)
            )
          ) {
            completion += currentChar;
          }
        }

        this.completion = completion;
      }
    }
  }

  onPointerdown(event) {
    event.stopPropagation();
  }
}