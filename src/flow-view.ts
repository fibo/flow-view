/**
 * Item identifier.
 *
 * @internal
 */
type Uid = string;

/**
 * Generates an identifier.
 *
 * @internal
 */
const generateUid = (length = 4): Uid =>
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
 * Util to get the position of an element. An HTMLElement that has a position,
 * stores it in the x and y attributes.
 */
const getPositionOfElement = (element: HTMLElement): Vector | undefined => {
  const vector = {
    x: parseInt(element.getAttribute("x") ?? ""),
    y: parseInt(element.getAttribute("y") ?? "")
  };
  if (!isVector(vector)) return undefined;
  return vector;
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
  | "fv-pin"
  | "fv-pins";

/**
 * All flow-view custom elements observed attributes.
 *
 * @internal
 */
const obervedAttributes: Record<FlowViewTagName, string[]> = {
  "flow-view": [],
  "fv-canvas": ["viewBox"],
  "fv-graph": [],
  "fv-edge": [],
  "fv-node": ["x", "y"],
  "fv-pin": [],
  "fv-pins": []
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
        font-family: var(--fv-font-family, system-ui, Roboto, sans-serif);
        font-size: var(--fv-font-size, 16px);
      }
    </style>
    <slot></slot>
  `,
  "fv-canvas": html`
    <style>
      :host {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 0;
        margin: 0;
        flex-grow: 1;
        background: var(--fv-background, #fefefe);
      }
      fv-graph {
        position: relative;
        display: block;
        flex-grow: 1;
      }
    </style>
    <fv-graph>
      <slot></slot>
    </fv-graph>
  `,
  "fv-graph": html`<slot></slot>`,
  "fv-edge": html`<div></div>`,
  "fv-node": html`
    <style>
      :host {
        position: absolute;
        display: flex;
        flex-direction: column;
        width: fit-content;
        box-shadow: var(--fv-box-shadow, 0px 0px 7px 1px rgba(0, 0, 0, 0.1));
        min-height: 2em;
        min-width: 2em;
      }
    </style>
    <slot></slot>
  `,
  "fv-pin": html`
    <style>
      :host {
        cursor: none;
        display: block;
        background: var(--fv-pin-background, #ccc);
        width: var(--fv-pin-size, 10px);
        height: var(--fv-pin-size, 10px);
      }
    </style>
    <slot></slot>
  `,
  "fv-pins": html`
    <style>
      :host {
        display: flex;
      }
    </style>
    <slot></slot>
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
 *   <fv-node x="10" y="10">Hello</fv-node>
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

  static get observedAttributes() {
    return obervedAttributes["fv-canvas"];
  }

  attributeChangedCallback(
    name: (typeof obervedAttributes)["fv-canvas"][number],
    _oldValue: string | null,
    _newValue: string | null
  ) {
    if (name === "viewBox") {
      // TODO
    }
  }

  /** The graph rendered in the canvas shadow DOM. */
  get graph(): FVGraph {
    return this.querySelector("fv-graph") as FVGraph;
  }

  get origin(): Vector {
    const { viewBox } = this;
    if (!viewBox) return { x: 0, y: 0 };
    const [x, y] = viewBox.split(" ").map((v) => parseInt(v));
    return { x, y };
  }

  /**
   * The viewBox of the canvas.
   *
   * It should behave similar to
   *
   * @link{https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox|SVG
   * viewBox}.
   */
  get viewBox() {
    return this.getAttribute("viewBox");
  }
}

/**
 * A graph contains nodes and edges.
 *
 * @internal
 */
class FVGraph extends HTMLElement {
  /** All pins of the graph are registered here. */
  private pins = new Map<Uid, FVPin>();

  constructor() {
    super();
    initElement(this, template["fv-graph"]);
  }

  /** Assign an identifier to a pin. */
  registerPin(pin: FVPin) {
    if (pin.uid && !this.pins.has(pin.uid)) {
      // Pin has already an indentifier and it is not taken.
      this.pins.set(pin.uid, pin);
    } else {
      // Assign a new identifier to the pin.
      pin.uid = generateUid();
      this.pins.set(pin.uid, pin);
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

  /** A pin can have an identifier. It is stored in the data-id attribute. */
  get uid(): string | undefined {
    return this.dataset.id;
  }

  /**
   * Set the pin identifier.
   *
   * @example
   *
   * ```ts
   * pin.uid = generateUid();
   * ```
   */
  set uid(value: string) {
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
      const newNum = parseInt(newValue);
      // Check the new value is an stringified integer.
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
      // Here new value is a stringified integer.
      const origin: Vector = this.canvas?.origin ?? { x: 0, y: 0 };
      if (name === "x") this.style.left = `${newNum - origin.x}px`;
      if (name === "y") this.style.top = `${newNum - origin.y}px`;
    }
  }

  /** Get the canvas where the node is rendered. */
  get canvas(): FVCanvas | undefined {
    const { parentElement: element } = this;
    if (element instanceof FVCanvas) return element;
  }

  /** Get the node position in the canvas space. */
  get position(): Vector | undefined {
    return getPositionOfElement(this);
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
 * Group of pins.
 *
 * @internal
 */
class FVPins extends HTMLElement {
  constructor() {
    super();
    initElement(this, template["fv-pins"]);
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
  "fv-pin": FVPin,
  "fv-pins": FVPins
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
export const defineFlowViewCustomElements = (
  elements = flowViewCustomElements
) => {
  for (const [elementName, ElementClass] of Object.entries(elements))
    if (!window.customElements.get(elementName))
      window.customElements.define(elementName, ElementClass);
};
