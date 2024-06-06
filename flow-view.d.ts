declare class FlowView extends HTMLElement {
}
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
export declare const defineFlowViewCustomElement: () => void;
declare global {
    interface HTMLElementTagNameMap {
        "flow-view": FlowView;
    }
}
export {};
