export class FlowViewItem extends HTMLElement {
  constructor(style = "", markup = "<slot></slot>") {
    super();

    const template = document.createElement("template");

    const defaultCss = {
      ":host([hidden])": {
        "display": "none",
      },
    };

    template.innerHTML = `<style>${
      FlowViewItem.generateStylesheet({ ...defaultCss, ...style })
    }</style>${markup}`;

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true),
    );
  }

  static elementName = {
    canvas: "fv-canvas",
    node: "fv-node",
    link: "fv-link",
    pin: "fv-pin",
  };

  static get observedAttributes() {
    return ["id"];
  }

  static generateStylesheet(style) {
    return Object.entries(style).reduce((stylesheet, [selector, rules]) => (
      [
        stylesheet,
        `${selector} {`,
        Object.entries(rules).map(
          ([key, value]) => `  ${key}: ${value};`,
        ).join("\n"),
        "}",
      ].join("\n")
    ), "");
  }

  static generateId() {
    const id = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 5);

    if (document.getElementById(id)) {
      return FlowViewItem.generateId();
    } else {
      return id;
    }
  }

  connectedCallback() {
    // Set a readonly id.
    const id = this.id || FlowViewItem.generateId();
    Object.defineProperty(this, "_id", { value: id, writable: false });
    this.setAttribute("id", id);
  }

  disconnectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      // The `id` attribute cannot be changed.
      case "id": {
        if (oldValue !== null && newValue !== this._id) {
          this.setAttribute("id", this._id);
        }
        break;
      }
    }
  }

  get canvas() {
    const { parentNode } = this;

    if (
      parentNode &&
      parentNode.tagName === FlowViewItem.elementName.canvas.toUpperCase()
    ) {
      return parentNode;
    } else {
      return null;
    }
  }
}
