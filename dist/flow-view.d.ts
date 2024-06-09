/**
 * All flow-view custom elements tag names.
 *
 * @internal
 */
type FlowViewTagName = "flow-view" | "fv-canvas" | "fv-graph" | "fv-edge" | "fv-node" | "fv-pin" | "fv-pins" | "fv-label";
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
export declare const defineFlowViewCustomElements: (elements?: Record<FlowViewTagName, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>) => void;
export {};
