export class FlowViewCanvas extends HTMLElement {
  static customElementName = "fv-canvas";

  constructor() {
    super();

    const template = document.createElement("template");

    template.innerHTML =
      `<style>:host { --fv-shadow-color: rgba(0, 0, 0, 0.17); display: block; overflow: hidden; background-color: var(--fv-canvas-background-color, #fefefe); box-shadow: 1px 1px 7px 1px var(--fv-shadow-color); width: 100%; height: 100%; position: relative; } :host([hidden]) { display: none; } </style> <svg></svg> <slot></slot>`;

    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true),
    );
  }
}
