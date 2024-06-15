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
 * Generates an identifier.
 *
 * @internal
 */
const generateUid = (length: number): string =>
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
  if (!arg || typeof arg != "object") return false;
  const { x, y } = arg as Partial<Vector>;
  if (typeof x != "number" || typeof y != "number") return false;
  return Number.isInteger(x) && Number.isInteger(y);
};

/** An element of a v-canvas. */
type IVCanvasElement = {
  get canvas(): VCanvas | undefined;
};

const createElementSvg = document.createElementNS.bind(
  document,
  "http://www.w3.org/2000/svg"
);

/** Look for the first v-canvas containing the given element. */
const findCanvas = (initialElement: HTMLElement): VCanvas | undefined => {
  let { parentElement: element } = initialElement;
  while (element) {
    if (element instanceof VCanvas) return element;
    element = element.parentElement;
  }
};

/**
 * Create an HTML template element from a string template.
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
 * All custom elements observed attributes.
 *
 * @internal
 */
const obervedAttributes: Record<
  Extract<TagName, "v-canvas" | "v-edge" | "v-node" | "v-pin">,
  string[]
> = {
  "v-canvas": [],
  "v-pin": ["uid"],
  "v-node": ["x", "y"],
  "v-edge": ["from", "to"]
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
  #pinMap = new Map<string, VPin>();
  readonly svg = createElementSvg("svg");

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const root = template["v-canvas"].content.cloneNode(true);
    root.appendChild(this.svg);
    this.shadowRoot!.appendChild(root);
  }

  attributeChangedCallback(
    _name: (typeof obervedAttributes)["v-canvas"][number],
    _oldValue: string | null,
    _newValue: string | null
  ) {
    // TODO check x, y (similar to VNode)
  }

  connectedCallback() {
    new ResizeObserver(this.resizeObserverCallback).observe(this);

    this.addEventListener("resize", this);
    this.addEventListener("pointerdown", this);
  }

  handleEvent(event: Event) {
    if (event.type == "pointerdown" && event.target == this) {
    }
  }

  get resizeObserverCallback(): ResizeObserverCallback {
    return (entries) => {
      for (let entry of entries) {
        if (entry.target !== this) continue;
        const { inlineSize, blockSize } = entry.contentBoxSize[0];
        // TODO create helper like coerceToCoordinate to be reused also inside v-node
        this.resizeSvg({ x: Math.floor(inlineSize), y: Math.floor(blockSize) });
      }
    };
  }

  resizeSvg({ x, y }: Vector) {
    const { svg } = this;
    svg.setAttribute("width", `${x}`);
    svg.setAttribute("height", `${y}`);
    svg.setAttribute("viewBox", `0 0 ${x} ${y}`);
  }

  get origin(): Vector {
    return { x: 0, y: 0 };
  }

  /** Get pin by its uid, if any. */
  getPinByUid(uid: string): VPin | undefined {
    if (this.#pinMap.has(uid)) return this.#pinMap.get(uid);
    const element = this.querySelector(`v-pin[uid=${uid}]`);
    if (element instanceof VPin) {
      this.#pinMap.set(uid, element);
      return element;
    }
  }

  /**
   * Set the uid of a pin.
   *
   * @remark Returns true or false if pin is registered or not.
   */
  setPinUid(pin: VPin, uid: string): boolean {
    if (uid == "") return false;
    const foundPin = this.#pinMap.get(uid);
    if (foundPin) {
      if (foundPin === pin) {
        if (pin.getAttribute("uid") !== uid) pin.setAttribute("uid", uid);
        return true;
      }
      return false;
    }
    this.#pinMap.set(uid, pin);
    pin.setAttribute("uid", uid);
    return true;
  }

  /**
   * Delete the uid of a pin.
   *
   * @remark Returns true or false if pin is registered or not.
   */
  deletePinUid(pin: VPin, uid: string): boolean {
    if (uid == "") return false;
    const foundPin = this.#pinMap.get(uid);
    if (foundPin === pin) {
      pin.removeAttribute("uid");
    }
    this.#pinMap.set(uid, pin);
    pin.setAttribute("uid", uid);
    return true;
  }
}

/**
 * A pin is the start or the end of an edge.
 *
 * @internal
 */
class VPin extends HTMLElement implements IVCanvasElement {
  #node: VNode | undefined;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.appendChild(template["v-pin"].content.cloneNode(true));
  }

  static get observedAttributes() {
    return obervedAttributes["v-pin"];
  }

  attributeChangedCallback(
    name: (typeof obervedAttributes)["v-pin"][number],
    _oldValue: string | null,
    newValue: string | null
  ) {
    if (name == "uid") {
      const { canvas } = this;
      if (canvas) {
        if (newValue) canvas?.setPinUid(this, newValue);
      }
    }
  }

  connectedCallback() {
    // Register pin into the canvas with a uid.
    if (this.canvas) {
      let uidLength = 3;
      let uid = this.getAttribute("uid") ?? generateUid(uidLength);
      let success = false;
      while (!success) {
        success = this.canvas.setPinUid(this, uid);
        uid = generateUid(uidLength++);
      }
    }
  }

  /** Get the canvas where the pin is rendered. */
  get canvas(): VCanvas | undefined {
    return this.node?.canvas;
  }

  /** Get the node where the pin is contained. */
  get node(): VNode | undefined {
    if (this.#node) return this.#node;
    // Look for the first v-node containing the pin.
    let { parentElement: element } = this;
    while (element) {
      if (element instanceof VNode) {
        this.#node = element;
        return element;
      }
      element = element.parentElement;
    }
  }

  /** A pin has an identifier that is unique in the v-canvas that contains it. */
  get uid(): string {
    return this.getAttribute("uid") ?? "";
  }
}

/**
 * A node can contain pins.
 *
 * @internal
 */
class VNode extends HTMLElement implements IVCanvasElement {
  #canvas: VCanvas | undefined;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.appendChild(template["v-node"].content.cloneNode(true));
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
      if (name == "x") this.style.left = `${newNum - origin.x}em`;
      if (name == "y") this.style.top = `${newNum - origin.y}em`;
    }
  }

  /** Get the canvas where the node is rendered. */
  get canvas(): VCanvas | undefined {
    if (this.#canvas) return this.#canvas;
    return (this.#canvas = findCanvas(this));
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
class VEdge extends HTMLElement implements IVCanvasElement {
  #canvas: VCanvas | undefined;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.appendChild(template["v-edge"].content.cloneNode(true));
  }

  static get observedAttributes() {
    return obervedAttributes["v-edge"];
  }

  attributeChangedCallback(
    name: (typeof obervedAttributes)["v-edge"][number],
    _oldValue: string | null,
    newValue: string | null
  ) {
    if (["from", "to"].includes(name) && newValue) {
      const pin = this.canvas?.getPinByUid(newValue);
      if (!pin) this.removeAttribute(name);
    }
  }

  /** Get the canvas where the edge is rendered. */
  get canvas(): VCanvas | undefined {
    if (this.#canvas) return this.#canvas;
    return (this.#canvas = findCanvas(this));
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
    this.shadowRoot!.appendChild(template["v-pins"].content.cloneNode(true));
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
    this.shadowRoot!.appendChild(template["v-label"].content.cloneNode(true));
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
