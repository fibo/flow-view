const html = (strings: TemplateStringsArray, ...expressions: string[]) => {
  const template = document.createElement("template");
  template.innerHTML = strings.reduce(
    (result, string, index) => result + string + (expressions[index] ?? ""),
    ""
  );
  return template;
};

const initElement = (
  element: HTMLElement,
  template: HTMLTemplateElement = html``
) => {
  element.attachShadow({ mode: "open" });
  element.shadowRoot?.appendChild(template.content.cloneNode(true));
};

class FlowView extends HTMLElement {
  constructor() {
    super();
  }
}

const pinTemplate = html`
  <style>
    div: {
      border: 1px solid;
    }
  </style>
  <div><slot></slot></div>
`;

class FVPin extends HTMLElement {
  constructor() {
    super();
    initElement(this, pinTemplate);
  }

  static get observedAttributes() {
    return ["x", "y"];
  }
}

const nodeTemplate = html` <div><slot></slot></div> `;

class FVNode extends HTMLElement {
  constructor() {
    super();
    initElement(this, nodeTemplate);
  }

  static get observedAttributes() {
    return ["x", "y"];
  }
}

const customElementsMap = new Map()
  .set("flow-view", FlowView)
  .set("fv-node", FVNode)
  .set("fv-pin", FVPin);

/**
 * Define flow-view Web Component.
 *
 * @example
 *
 * ```ts
 * import { defineFlowViewCustomElements } from "flow-view";
 *
 * defineFlowViewCustomElements();
 * ```
 */
export const defineFlowViewCustomElements = () => {
  for (const [elementName, ElementClass] of customElementsMap)
    if (!window.customElements.get(elementName))
      window.customElements.define(elementName, ElementClass);
};

declare global {
  interface HTMLElementTagNameMap {
    "flow-view": FlowView;
    "fv-node": FVNode;
  }
}
