export class FlowViewBase {
  static generateId(shadowDom) {
    const id = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 5);

    if (shadowDom.getElementById(id)) {
      return FlowViewBase.generateId(shadowDom);
    } else {
      return id;
    }
  }

  constructor({ cssClassName, id, shadowDom, ...rest }) {
    this.shadowDom = shadowDom;

    const element = this.element = document.createElement("div");
    element.classList.add(cssClassName);

    const _id = id || FlowViewBase.generateId(shadowDom);
    element.setAttribute("id", _id);

    shadowDom.appendChild(element);

    this.init(rest);
  }

  init() {}

  createDiv(cssClassName) {
    const div = document.createElement("div");
    div.classList.add(cssClassName);
    this.element.appendChild(div);
    return div;
  }
}
