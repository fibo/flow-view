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
      "z-index": FlowViewSelector.zIndex,
    },
    [`.${FlowViewSelector.cssClassName} input`]: {
      "border": 0,
      "margin": 0,
      "outline": 0,
      "border-radius": cssVar.borderRadius,
      "font-family": cssVar.fontFamily,
      "font-size": cssVar.fontSize,
      "padding": "0.5em",
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

  init({ position, nodeDefinitions }) {
    const { element } = this;

    element.setAttribute("tabindex", 0);

    const hint = this.hint = document.createElement("input");
    hint.classList.add(`${FlowViewSelector.cssClassName}__hint`);
    element.appendChild(hint);

    const input = this.input = document.createElement("input");
    element.appendChild(input);

    this.position = position;

    // Sort nodeDefinitions by label, there should not be two equal labels.
    this.nodeDefinitions = nodeDefinitions.sort((
      { label: a },
      { label: b },
    ) => (a < b ? -1 : 1));

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

  get matchingNodeDefinitions() {
    const { input: { value } } = this;

    // Type at least few chars to start showing completion.
    if (value.length < 2) return [];

    return this.nodeDefinitions.filter(({ label }) => (
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
    element.style.top = `${y - view.origin.y}px`;
    element.style.left = `${x - view.origin.x}px`;
    this.x = x;
    this.y = y;
  }

  get position() {
    return { x: this.x, y: this.y };
  }

  createNode() {
    const { input: { value }, nodeDefinitions, position: { x, y }, view } =
      this;

    const nodeDefinition =
      nodeDefinitions.find(({ label }) => (label === value)) || {};

    view.newNode({
      x,
      y,
      label: value,
      ...nodeDefinition,
    });
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

    const { input: { value }, matchingNodeDefinitions } = this;

    switch (matchingNodeDefinitions.length) {
      case 0: {
        this.completion = "";
        break;
      }
      case 1: {
        this.completion = matchingNodeDefinitions[0].label;
        break;
      }
      default: {
        let completion = value;

        const shortestMatch = matchingNodeDefinitions.reduce((
          shortest,
          match,
        ) => (shortest.label.length < match.label.length ? shortest : match));

        for (let i = value.length; i < shortestMatch.label.length; i++) {
          const currentChar = shortestMatch.label[i];

          if (
            matchingNodeDefinitions.every(({ label }) =>
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
