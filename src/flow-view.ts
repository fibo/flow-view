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
 * All FlowView custom elements tag names.
 *
 * @internal
 */
type FlowViewTagName =
  | "v-canvas"
  | "v-graph"
  | "v-edge"
  | "v-node"
  | "v-pin"
  | "v-pins"
  | "v-label";

/**
 * All FlowView custom elements observed attributes.
 *
 * @internal
 */
const obervedAttributes: Record<FlowViewTagName, string[]> = {
  "v-canvas": [],
  "v-graph": [],
  "v-edge": [],
  "v-node": ["x", "y"],
  "v-pin": [],
  "v-pins": [],
  "v-label": []
};

/**
 * All FlowView custom elements templates.
 *
 * @internal
 */
const template: Record<FlowViewTagName, HTMLTemplateElement> = {
  "v-canvas": html`
    <style>
      :host {
        --flow-view-unit: 10px;
        --flow-view-font-family: system-ui, Roboto, sans-serif;
        --flow-view-canvas-color: #fefefe;
        --flow-view-text-color: #121212;
        --flow-view-node-shadow: 0 0 0.7em 0.1em rgba(0, 0, 0, 0.1);
        --flow-view-pin-color: #ccc;

        display: flex;
        flex-direction: column;
        overflow: hidden;
        height: 100%;
        font-family: var(--flow-view-font-family);
        font-size: var(--unit, var(--flow-view-unit));
        border: 0;
        margin: 0;
        flex-grow: 1;
        background-color: var(--flow-view-canvas-color);
        color: var(--flow-view-text-color);
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
  "v-graph": html`<slot></slot>`,
  "v-edge": html`<div></div>`,
  "v-node": html`
    <style>
      :host {
        --shadow: var(--flow-view-node-shadow);
        position: absolute;
        box-shadow: var(--shadow);
        border-radius: 0.5em;
      }
    </style>
    <slot></slot>
  `,
  "v-pin": html`
    <style>
      :host {
        --color: var(--flow-view-pin-color);
        display: block;
        width: 1em;
        height: 1em;
        background-color: var(--color);
        border-radius: 0.5em;
      }
    </style>
    <slot></slot>
  `,
  "v-pins": html`
    <style>
      :host {
        display: flex;
        justify-content: space-between;
        min-height: 1em;
      }
    </style>
    <slot></slot>
  `,
  "v-label": html`
    <style>
      :host {
        font-size: 1.5em;
        padding-inline: 0.5em;
        user-select: none;
      }
    </style>
    <slot></slot>
  `
};

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
class VCanvas extends HTMLElement {
  /** Coordinate of the origin. */
  x = 0;
  /** Coordinate of the origin. */
  y = 0;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot?.appendChild(template["v-canvas"].content.cloneNode(true));
  }

  static get observedAttributes() {
    return obervedAttributes["v-canvas"];
  }

  attributeChangedCallback(
    _name: (typeof obervedAttributes)["v-canvas"][number],
    _oldValue: string | null,
    _newValue: string | null
  ) {
    // TODO
  }

  /** The graph rendered in the canvas shadow DOM. */
  get graph(): VGraph {
    return this.shadowRoot!.querySelector("v-graph") as VGraph;
  }

  get origin(): Vector {
    return { x: this.x, y: this.y };
  }
}

/**
 * A graph contains nodes and edges.
 *
 * @internal
 */
class VGraph extends HTMLElement {
  /** All pins of the graph are registered here. */
  private pins = new Map<Uid, VPin>();

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot?.appendChild(template["v-graph"].content.cloneNode(true));
  }

  /** Assign an identifier to a pin. */
  registerPin(pin: VPin) {
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
class VPin extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot?.appendChild(template["v-pin"].content.cloneNode(true));
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
class VNode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot?.appendChild(template["v-node"].content.cloneNode(true));
  }

  static get observedAttributes() {
    return obervedAttributes["v-node"];
  }

  attributeChangedCallback(
    name: (typeof obervedAttributes)["v-node"][number],
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
      if (name === "x") this.style.left = `${newNum - origin.x}em`;
      if (name === "y") this.style.top = `${newNum - origin.y}em`;
    }
  }

  /** Get the canvas where the node is rendered. */
  get canvas(): VCanvas | undefined {
    const { parentElement: element } = this;
    if (element instanceof VCanvas) return element;
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
class VEdge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot?.appendChild(template["v-edge"].content.cloneNode(true));
  }
}

/**
 * Group of pins.
 *
 * @internal
 */
class FlowViewPins extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot?.appendChild(template["v-pins"].content.cloneNode(true));
  }
}

/**
 * Display inline text.
 *
 * @internal
 */
class VLabel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot?.appendChild(template["v-label"].content.cloneNode(true));
  }
}

/**
 * All FlowView HTML elements.
 *
 * @internal
 */
const flowViewElements: Record<FlowViewTagName, typeof HTMLElement> = {
  "v-canvas": VCanvas,
  "v-edge": VEdge,
  "v-graph": VGraph,
  "v-node": VNode,
  "v-pin": VPin,
  "v-pins": FlowViewPins,
  "v-label": VLabel
};

/**
 * Define HTML custom elements v-canvas, v-node, v-edge, etc.
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
  for (const [elementName, ElementClass] of Object.entries(flowViewElements))
    if (!window.customElements.get(elementName))
      window.customElements.define(elementName, ElementClass);
};
