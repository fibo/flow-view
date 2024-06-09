/**
 * Creates an HTML template element from a string template.
 *
 * @example
 *
 * ```ts
 * const myTemplate = html`
 *   <style>
 *     :host {
 *       display: block;
 *     }
 *   </style>
 *   <div><slot></slot></div>
 * `;
 * ```
 *
 * @internal
 */
const html = (strings: TemplateStringsArray, ...expressions: string[]) => {
  const template = document.createElement("template");
  template.innerHTML = strings.reduce(
    (result, string, index) => result + string + (expressions[index] ?? ""),
    ""
  );
  return template;
};

/**
 * Util to initialize an element with a template.
 *
 * @example
 *
 * ```ts
 * const myTemplate = html`<div><slot></slot></div>`;
 *
 * class MyElement extends HTMLElement {
 *   constructor() {
 *     super();
 *     initElement(this, myTemplate);
 *   }
 * }
 * ```
 *
 * @internal
 */
const initElement = (element: HTMLElement, template: HTMLTemplateElement) => {
  element.attachShadow({ mode: "open" });
  element.shadowRoot?.appendChild(template.content.cloneNode(true));
};

/** @internal */
type FlowViewTagName =
  | "flow-view"
  | "fv-canvas"
  | "fv-graph"
  | "fv-edge"
  | "fv-node"
  | "fv-pin";

/** @internal */
const template: Record<FlowViewTagName, HTMLTemplateElement> = {
  "flow-view": html``,
  "fv-graph": html``,
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

/**
 * The flow-view custom element.
 *
 * @internal
 */
class FlowView extends HTMLElement {
  constructor() {
    super();
    initElement(this, template["flow-view"]);
  }
}

/**
 * A canvas renders a graph.
 *
 * @internal
 */
class FVCanvas extends HTMLElement {
  constructor() {
    super();
    initElement(this, template["fv-canvas"]);
  }
}

/**
 * A graph contains nodes and edges.
 *
 * @internal
 */
class FVGraph extends HTMLElement {
  constructor() {
    super();
    initElement(this, template["fv-graph"]);
  }
}

/**
 * A pin is the start or the end of an edge.
 *
 * @internal
 */
class FVPin extends HTMLElement {
  constructor() {
    super();
    initElement(this, template["fv-pin"]);
  }
}

/**
 * A node can contain pins.
 *
 * @internal
 */
class FVNode extends HTMLElement {
  constructor() {
    super();
    initElement(this, template["fv-node"]);
  }

  static get observedAttributes() {
    return ["x", "y"];
  }
}

/**
 * An edge connects two pins.
 *
 * @internal
 */
class FVEdge extends HTMLElement {
  constructor() {
    super();
    initElement(this, template["fv-edge"]);
  }
}

/**
 * All flow-view custom elements.
 *
 * @internal
 */
const flowViewCustomElements: Record<FlowViewTagName, typeof HTMLElement> = {
  "flow-view": FlowView,
  "fv-canvas": FVCanvas,
  "fv-edge": FVEdge,
  "fv-graph": FVGraph,
  "fv-node": FVNode,
  "fv-pin": FVPin
};

/**
 * Define Web Components flow-view, fv-node, fv-edge, etc.
 *
 * @example
 *
 * ```ts
 * import { defineFlowViewCustomElements } from "flow-view";
 *
 * window.addEventListener("load", () => {
 *   defineFlowViewCustomElements();
 * });
 * ```
 */
export const defineFlowViewCustomElements = () => {
  for (const [elementName, ElementClass] of Object.entries(
    flowViewCustomElements
  ))
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
