declare class FlowView extends HTMLElement {
    constructor();
}
declare class FVNode extends HTMLElement {
    constructor();
    static get observedAttributes(): string[];
}
/**
 * Define flow-view Web Component.
 *
 * @example
 *
 * ```ts
 * import { defineFlowViewCustomElements } from "flow-view"
 *
 * defineFlowViewCustomElements()
 * ```
 */
export declare const defineFlowViewCustomElements: () => void;
declare global {
    interface HTMLElementTagNameMap {
        "flow-view": FlowView;
        "fv-node": FVNode;
    }
}
export {};
