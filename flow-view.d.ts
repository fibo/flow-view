declare class FlowView extends HTMLElement {
    constructor();
}
declare class FVPin extends HTMLElement {
    constructor();
}
declare class FVNode extends HTMLElement {
    constructor();
    static get observedAttributes(): string[];
}
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
export declare const defineFlowViewCustomElements: () => void;
declare global {
    interface HTMLElementTagNameMap {
        "flow-view": FlowView;
        "fv-canvas": FVNode;
        "fv-node": FVNode;
        "fv-pin": FVPin;
    }
}
export {};
