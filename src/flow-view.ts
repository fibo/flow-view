/**
 * Item identifier.
 *
 * @internal
 */
type Id = string;

/**
 * Generates an identifier.
 *
 * @internal
 */
const generateId = (length = 4): Id =>
  Math.random()
    .toString(36)
    .substring(2, 2 + length);

/**
 * A vector with integer coordinates. To be used in the canvas space.
 *
 * @internal
 */
type Vector = {
  x: number;
  y: number;
};

/**
 * A type guard to check if a value is a vector.
 *
 * @internal
 */
const isVector = (arg: unknown): arg is Vector => {
  if (!arg || typeof arg !== "object") return false;
  const { x, y } = arg as Partial<Vector>;
  if (typeof x !== "number" || typeof y !== "number") return false;
  return Number.isInteger(x) && Number.isInteger(y);
};

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

/**
 * All flow-view custom elements tag names.
 *
 * @internal
 */
type FlowViewTagName =
  | "flow-view"
  | "fv-canvas"
  | "fv-graph"
  | "fv-edge"
  | "fv-node"
  | "fv-pin";

/**
 * All flow-view custom elements observed attributes.
 *
 * @internal
 */
const obervedAttributes: Record<FlowViewTagName, string[]> = {
  "flow-view": [],
  "fv-canvas": [],
  "fv-graph": [],
  "fv-edge": [],
  "fv-node": ["x", "y"],
  "fv-pin": []
};

/**
 * All flow-view custom elements templates.
 *
 * @internal
 */
const template: Record<FlowViewTagName, HTMLTemplateElement> = {
  "flow-view": html`
    <style>
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    </style>
    <slot></slot>
  `,
  "fv-graph": html` <style>
      :host {
        height: 100%;
      }
    </style>
    <slot></slot>`,
  "fv-canvas": html`
    <style>
      :host {
        position: relative;
        display: block;
        overflow: hidden;
        border: 0;
        margin: 0;
        flex-grow: 1;
        background: var(--fv-canvas-background, #fefefe);
      }
    </style>
    <div><slot></slot></div>
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
 * @remarks
 * It handles a two dimensional discrete space, where discrete means that
 * coordinates are integers.
 * @example
 *
 * ```html
 * <fv-canvas>
 *   <fv-graph>
 *     <fv-node x="10" y="10">Hello</fv-node>
 *   </fv-graph>
 * </fv-canvas>
 * ```
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
  /** All pins of the graph are registered here. */
  pins = new Map<Id, FVPin>();

  constructor() {
    super();
    initElement(this, template["fv-graph"]);
  }

  /** Assign an id to a pin. */
  registerPin(pin: FVPin) {
    if (pin.pinId && !this.pins.has(pin.pinId)) {
      // Pin has already an id and it is not taken.
      this.pins.set(pin.pinId, pin);
    } else {
      // Assign a new id to the pin.
      pin.pinId = generateId();
      this.pins.set(pin.pinId, pin);
    }
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

  /** A pin can have an id; it is used by edges that reference it. */
  get pinId(): string | undefined {
    return this.dataset.id;
  }

  /**
   * Set the pin id.
   *
   * @example
   *
   * ```ts
   * pin.pinId = generateId();
   * ```
   */
  set pinId(value: string) {
    this.dataset.id = value;
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
    return obervedAttributes["fv-node"];
  }

  attributeChangedCallback(
    name: (typeof obervedAttributes)["fv-node"][number],
    oldValue: string | null,
    newValue: string | null
  ) {
    // Handle a position change.
    if (["x", "y"].includes(name)) {
      // Let the attribute to be removed.
      if (newValue === null) return;
      // Check the new value is an integer.
      const newNum = parseInt(newValue);
      if (Number.isInteger(newNum)) {
        // If new value is a number but not exactly an integer, set the attribute with a correct value.
        if (String(newNum) !== newValue) {
          this.setAttribute(name, String(newNum));
        }
      } else {
        // If new value cannot be coerced to integer, try to replace it with the old value.
        const oldNum = parseInt(oldValue ?? "");
        if (Number.isInteger(oldNum)) {
          this.setAttribute(name, String(oldNum));
        } else {
          // If old value is not an integer, fallback to zero.
          this.setAttribute(name, "0");
        }
      }
    }
  }

  /** Get the node position in the canvas space. */
  get position(): Vector | undefined {
    const vector = {
      x: parseInt(this.getAttribute("x") ?? ""),
      y: parseInt(this.getAttribute("y") ?? "")
    };
    if (!isVector(vector)) return undefined;
    return vector;
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
