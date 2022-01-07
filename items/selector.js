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

    // Sort nodeDefinitions by type, there should not be two equal types.
    this.nodeDefinitions = nodeDefinitions.sort((
      { type: a },
      { type: b },
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

    return this.nodeDefinitions.filter(({ type }) => (
      // input value fits into node type...
      type.startsWith(value) &&
      // ...but they are not the same yet.
      // Otherwise if a type starts with another type,
      // some completions could be missed.
      type !== value
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
        this.completion = matchingNodeDefinitions[0].type;
        break;
      }
      default: {
        let completion = value;

        const shortestMatch = matchingNodeDefinitions.reduce((
          shortest,
          match,
        ) => (shortest.type.length < match.type.length ? shortest : match));

        for (let i = value.length; i < shortestMatch.type.length; i++) {
          const currentChar = shortestMatch.type[i];

          if (
            matchingNodeDefinitions.every(({ type }) =>
              type.startsWith(completion + currentChar)
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
