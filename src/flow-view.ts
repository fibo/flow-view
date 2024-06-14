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
 * All custom elements tag names.
 *
 * @internal
 */
type TagName =
  | "v-canvas"
  | "v-edge"
  | "v-node"
  | "v-pin"
  | "v-pins"
  | "v-label";

/**
 * All custom elements observed attributes.
 *
 * @internal
 */
const obervedAttributes: Record<
  Extract<TagName, "v-canvas" | "v-node">,
  string[]
> = {
  "v-canvas": [],
  "v-node": ["x", "y"]
};

/**
 * All custom elements templates.
 *
 * @internal
 */
const template: Record<TagName, HTMLTemplateElement> = {
  "v-canvas": html`
    <style>
      :host {
        --unit: var(--flow-view-unit, 10px);

        font-family: var(
          --flow-view-font-family,
          system-ui,
          Roboto,
          sans-serif
        );
        font-size: var(--unit);

        --transition: var(--flow-view-transition, 200ms ease-in-out);

        background-color: var(--flow-view-background-color, #fefefe);
        color: var(--flow-view-text-color, #121212);

        @media (prefers-color-scheme: dark) {
          background-color: var(--flow-view-background-color, #555);
          color: var(--flow-view-text-color, #ccc);
        }

        display: block;
        overflow: hidden;
        position: relative;
        height: 100%;
        border: 0;
        margin: 0;
      }
    </style>
    <slot></slot>
  `,

  "v-edge": html`<div></div>`,

  "v-node": html`
    <style>
      :host {
        position: absolute;
        border-radius: 0.5em;
        padding: 2px;
        border: 1px solid;
        transition: all var(--transition);
      }
    </style>
    <slot></slot>
  `,

  "v-pin": html`
    <style>
      :host {
        display: block;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        background-color: currentColor;
        opacity: 0.8;
        transition: all var(--transition);
      }
      :host(:hover) {
        opacity: 1;
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
 * <v-canvas>
 *   <v-node x="10" y="10">Hello</v-node>
 * </v-canvas>
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

  attributeChangedCallback(
    _name: (typeof obervedAttributes)["v-canvas"][number],
    _oldValue: string | null,
    _newValue: string | null
  ) {
    // TODO
  }

  connectedCallback() {
    this.addEventListener("pointerdown", this);
  }

  get origin(): Vector {
    return { x: this.x, y: this.y };
  }

  handleEvent(event: Event) {
    if (event.type == "pointerdown" && event.target == this) {
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
class VPins extends HTMLElement {
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
 * All HTML elements.
 *
 * @internal
 */
const htmlElements: Record<TagName, typeof HTMLElement> = {
  "v-canvas": VCanvas,
  "v-edge": VEdge,
  "v-node": VNode,
  "v-pin": VPin,
  "v-pins": VPins,
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
  for (const [elementName, ElementClass] of Object.entries(htmlElements))
    if (!window.customElements.get(elementName))
      window.customElements.define(elementName, ElementClass);
};
