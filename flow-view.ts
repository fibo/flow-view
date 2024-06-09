/** @internal */
const html = (strings: TemplateStringsArray, ...expressions: string[]) => {
  const template = document.createElement("template");
  template.innerHTML = strings.reduce(
    (result, string, index) => result + string + (expressions[index] ?? ""),
    ""
  );
  return template;
};

/** @internal */
const initElement = (element: HTMLElement, template: HTMLTemplateElement) => {
  element.attachShadow({ mode: "open" });
  element.shadowRoot?.appendChild(template.content.cloneNode(true));
};

/** @internal */
type FlowViewElementName =
  | "flow-view"
  | "fv-canvas"
  | "fv-edge"
  | "fv-node"
  | "fv-pin";

/** @internal */
const template: Record<FlowViewElementName, HTMLTemplateElement> = {
  "flow-view": html``,
  "fv-canvas": html`
    <style>
      :host {
        position: relative;
        display: block;
        overflow: hidden;
        border: 0;
        margin: 0;
      }
    </style>
  `,
  "fv-edge": html``,
  "fv-node": html` <div><slot></slot></div> `,
  "fv-pin": html`
    <style>
      div: {
        border: 1px solid;
      }
    </style>
    <div><slot></slot></div>
  `
};

class FlowView extends HTMLElement {
  constructor() {
    super();
  }
}

class FVCanvas extends HTMLElement {
  constructor() {
    super();
    initElement(this, template["fv-canvas"]);
  }
}

class FVPin extends HTMLElement {
  constructor() {
    super();
    initElement(this, template["fv-pin"]);
  }
}

class FVNode extends HTMLElement {
  constructor() {
    super();
    initElement(this, template["fv-node"]);
  }

  static get observedAttributes() {
    return ["x", "y"];
  }
}

const customElementsMap = new Map()
  .set("flow-view", FlowView)
  .set("fv-canvas", FVCanvas)
  .set("fv-node", FVNode)
  .set("fv-pin", FVPin);

/**
 * Define Web Components flow-view, fv-node, fv-edge, etc.
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
    "fv-canvas": FVNode;
    "fv-node": FVNode;
    "fv-pin": FVPin;
  }
}
