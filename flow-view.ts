class FlowView extends HTMLElement {}

/**
 * Define flow-view Web Component.
 *
 * @example
 *
 * ```ts
 * import { defineFlowViewCustomElement } from "flow-view"
 *
 * defineFlowViewCustomElement()
 * ```
 */
export const defineFlowViewCustomElement = () => {
  if (!window.customElements.get("flow-view"))
    window.customElements.define("flow-view", FlowView)
}

declare global {
  interface HTMLElementTagNameMap {
    "flow-view": FlowView
  }
}
