import { cssModifierHighlighted } from "../theme.js";

export class FlowViewBase {
  static generateId(view) {
    const id = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 5);

    if (view.shadowRoot.getElementById(id)) {
      return FlowViewBase.generateId(view);
    } else {
      return id;
    }
  }

  constructor({ cssClassName, id, view, ...rest }) {
    this.cssClassName = cssClassName;

    const _id = id || FlowViewBase.generateId(view);

    this.view = view;

    const element = this.element = document.createElement("div");
    element.setAttribute("id", _id);
    element.classList.add(cssClassName);
    view.shadowRoot.appendChild(element);

    this.init(rest);
  }

  init() {}

  dispose() {}

  get bounds() {
    return this.element.getBoundingClientRect();
  }

  get id() {
    return this.element.getAttribute("id");
  }

  set highlight(value) {
    const cssClassName = cssModifierHighlighted(this.cssClassName);

    if (value) {
      this.element.classList.add(cssClassName);
    } else {
      this.element.classList.remove(cssClassName);
    }
  }

  createDiv(cssClassName) {
    const div = document.createElement("div");
    div.classList.add(cssClassName);
    this.element.appendChild(div);
    return div;
  }

  createSvg(tag) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
  }

  remove() {
    this.dispose();

    this.element.remove();
  }
}
