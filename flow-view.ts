class FlowView extends HTMLElement {
  constructor() {
    super();
  }
}

class FVNode extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["x", "y"];
  }
}

const customElementsMap = new Map()
  .set("flow-view", FlowView)
  .set("fv-node", FVNode);

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
