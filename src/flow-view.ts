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
 * A vector with integer coordinates.
 *
 * @internal
 */
type Vector = {
  x: number;
  y: number;
};

/** @internal */
const createElementSvg = document.createElementNS.bind(
  document,
  "http://www.w3.org/2000/svg"
);

/**
 * Look for the first v-canvas containing the given element.
 *
 * @internal
 */
const findCanvas = (initialElement: Element): VCanvas | undefined => {
  let { parentElement: element } = initialElement;
  while (element) {
    if (element.tagName == "V-CANVAS") return element as VCanvas;
    element = element.parentElement;
  }
};

/**
 * Look for the first parent element with given tagName.
 *
 * @internal
 */
const findNode = (initialElement: Element): VNode | undefined => {
  let { parentElement: element } = initialElement;
  while (element) {
    if (element.tagName == "V-NODE") return element as VNode;
    element = element.parentElement;
  }
};

/** @internal */
class ErrorCanvasNotFound extends Error {
  constructor() {
    super("v-canvas not found");
  }
}

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
  "v-edge": ["pins"]
};

/**
 * All custom elements templates.
 *
 * @internal
 */
const template: Record<Exclude<TagName, "v-edge">, HTMLTemplateElement> = {
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
  #pinElementMap = new Map<string, Element>();
  #uidSet = new Set<string>();
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

    this.addEventListener("pointerdown", this);
  }

  handleEvent(event: Event) {
    if (event.type == "pointerdown" && event.target == this) {
    }
  }

  #newUid(len = 2) {
    let uid = "";
    let alreadyExists = true;
    while (alreadyExists) {
      uid = Math.random()
        .toString(36)
        .substring(2, 2 + len);
      alreadyExists = this.#uidSet.has(uid);
      len++;
    }
    this.#uidSet.add(uid);
    return uid;
  }

  /**
   * Create a uid and register it. Return the created uid.
   *
   * @internal
   */
  createUid() {
    const uid = this.#newUid();
    this.#uidSet.add(uid);
    return uid;
  }
  /**
   * Register given uid.
   *
   * @remark Return a boolean according if the operation was successfull.
   *
   * @internal
   */
  registerUid(uid: string): boolean {
    if (this.#uidSet.has(uid)) return false;
    this.#uidSet.add(uid);
    return true;
  }

  /** @internal */
  createLine(start: Vector, end: Vector) {
    const r = "2",
      x1 = `${start.x}`,
      y1 = `${start.y}`,
      x2 = `${end.x}`,
      y2 = `${end.y}`;
    const group = createElementSvg("g");
    const circle1 = createElementSvg("circle");
    circle1.setAttribute("r", r);
    circle1.setAttribute("cx", x1);
    circle1.setAttribute("cy", y1);
    group.appendChild(circle1);
    const line = createElementSvg("line");
    line.setAttribute("stroke", "currentColor");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    group.appendChild(line);
    const circle2 = createElementSvg("circle");
    circle2.setAttribute("r", r);
    circle2.setAttribute("cx", x2);
    circle2.setAttribute("cy", y2);
    group.appendChild(circle2);
    this.svg.appendChild(group);
  }

  /**
   * A ResizeObserver callback implementation.
   *
   * @internal
   */
  get resizeObserverCallback(): ResizeObserverCallback {
    return (entries) => {
      entries
        .filter((entry) => entry.target === this)
        .forEach(({ contentBoxSize: [boxSize] }) => {
          const { origin, svg } = this;
          // TODO create helper like coerceToCoordinate to be reused also inside v-node
          const x = Math.floor(boxSize.inlineSize),
            y = Math.floor(boxSize.blockSize);
          svg.setAttribute("width", `${x}`);
          svg.setAttribute("height", `${y}`);
          svg.setAttribute("viewBox", `${origin.x} ${origin.y} ${x} ${y}`);
        });
    };
  }

  /** @internal */
  get origin(): Vector {
    return { x: 0, y: 0 };
  }

  /**
   * Get pin by its uid, if any.
   *
   * @internal
   */
  getPinElementByUid(uid: string): Element | undefined {
    if (this.#pinElementMap.has(uid)) {
      return this.#pinElementMap.get(uid);
    } else {
      const element = this.querySelector(`v-pin[uid="${uid}"]`);
      if (element) {
        this.#pinElementMap.set(uid, element);
        return element;
      }
    }
  }
}

/**
 * A pin is the start or the end of an edge.
 *
 * @internal
 */
class VPin extends HTMLElement {
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
    const { canvas } = this;

    if (name == "uid") {
      if (newValue) {
        const success = canvas.registerUid(newValue);
        if (!success) this.removeAttribute("uid");
      } else {
        this.setAttribute("uid", canvas.createUid());
      }
    }
  }

  /**
   * Get the canvas where the pin is rendered.
   *
   * @internal
   */
  get canvas(): VCanvas {
    const canvas = this.node?.canvas;
    if (!canvas) {
      this.remove();
      throw new ErrorCanvasNotFound();
    }
    return canvas;
  }

  /**
   * Get the node where the pin is contained.
   *
   * @internal
   */
  get node(): VNode | undefined {
    if (this.#node) return this.#node;
    const node = findNode(this);
    if (node) return (this.#node = node);
  }

  /**
   * A pin has an identifier that is unique in the v-canvas that contains it.
   *
   * @internal
   */
  get uid(): string {
    return this.getAttribute("uid") ?? "";
  }
}

/**
 * A node can contain pins.
 *
 * @internal
 */
class VNode extends HTMLElement {
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
    if (name == "x" || name == "y") {
      // Let the attribute to be removed.
      if (newValue === null) return;
      const newNum = parseInt(newValue);
      // Check the new value is an stringified integer.
      if (Number.isInteger(newNum)) {
        // If new value is a number but not exactly an integer,
        // set the attribute with a correct value.
        if (String(newNum) !== newValue) {
          this.setAttribute(name, String(newNum));
        } else {
          // Update node geometry.
          this.updateGeometry(name);
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

  /**
   * Get the canvas where the node is rendered.
   *
   * @internal
   */
  get canvas(): VCanvas {
    if (this.#canvas) return this.#canvas;
    const canvas = findCanvas(this);
    if (!canvas) {
      this.remove();
      throw new ErrorCanvasNotFound();
    }
    return (this.#canvas = canvas);
  }

  /** @internal */
  updateGeometry(name: "x" | "y") {
    const { origin } = this.canvas;
    const value = this.getAttribute(name);
    if (name == "x") this.style.left = `${Number(value) - origin.x}em`;
    if (name == "y") this.style.top = `${Number(value) - origin.y}em`;
  }
}

/**
 * An edge connects a list of two or more pins.
 *
 * @remark A v-edge must be placed in the DOM after the pins it references.
 *
 * @internal
 */
class VEdge extends HTMLElement {
  #canvas: VCanvas | undefined;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return obervedAttributes["v-edge"];
  }

  attributeChangedCallback(
    name: (typeof obervedAttributes)["v-edge"][number],
    _oldValue: string | null,
    newValue: string | null
  ) {
    if (name === "pins") {
      if (!newValue) return;
      // Get only the pin uids that reference a pin.
      const pinUids = newValue
        .split(",")
        .map((uid) => uid.trim())
        .filter((uid) => this.canvas.getPinElementByUid(uid));
      // An edge connects at least two pins.
      if (pinUids.length < 2) {
        this.removeAttribute("pins");
      } else {
        const normalizedValue = pinUids.join();
        if (newValue === normalizedValue) {
          this.updateGeometry(pinUids);
        } else {
          this.setAttribute(name, normalizedValue);
        }
      }
    }
  }

  /**
   * Get the canvas where the edge is rendered.
   *
   * @internal
   */
  get canvas(): VCanvas {
    if (this.#canvas) return this.#canvas;
    const canvas = findCanvas(this);
    if (!canvas) {
      this.remove();
      throw new ErrorCanvasNotFound();
    }
    return (this.#canvas = canvas);
  }

  /**
   * Draw the segments that compose the edge.
   *
   * @internal
   */
  updateGeometry(pinUids: string[]) {
    const { canvas } = this;
    const { top, left } = canvas.getBoundingClientRect();
    for (let i = 0; i < pinUids.length - 1; i++) {
      const start = canvas.getPinElementByUid(pinUids[i]);
      const end = canvas.getPinElementByUid(pinUids[i + 1]);
      console.log(start, end);
      if (!start || !end) continue;
      const position1 = start.getBoundingClientRect();
      const position2 = end.getBoundingClientRect();
      console.log(position1, position2);
      /*
      canvas.createLine(
        { x: position1.left - left, y: position1.top - top },
        { x: position2.left - left, y: position2.top - top }
      );
      */
    }
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
