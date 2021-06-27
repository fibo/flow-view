export class FlowViewItem extends HTMLElement {
  constructor(style = "", markup = "<slot></slot>") {
    super();

    const template = document.createElement("template");

    template.innerHTML =
      `<style>${style} :host([hidden]) { display: none; }</style> ${markup}`;

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true),
    );
  }

  static get observedAttributes() {
    return ["id"];
  }

  static generateId(prefix = "fv") {
    const randomString = Math.random().toString(36).replace(/[^a-z]+/g, "")
      .substr(0, 5);

    const id = `${prefix}:${randomString}`;

    if (document.getElementById(id)) {
      return FlowViewItem.generateId(prefix);
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
}
