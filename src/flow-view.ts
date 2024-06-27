/**
 * All custom elements tag names.
 *
 * @internal
 */
type VElementName =
  | "v-canvas"
  | "v-edge"
  | "v-node"
  | "v-pin"
  | "v-label"
  | "v-row"
  | "v-col";

/**
 * A vector in 2d space.
 *
 * @internal
 */
type Vector = {
  x: number;
  y: number;
};

/**
 * Util to create an SVG element.
 *
 * @internal
 */
const createElementSvg = document.createElementNS.bind(
  document,
  "http://www.w3.org/2000/svg"
);

/**
 * Look for the first parent element with the given name containing the element.
 *
 * @internal
 */
const findParentElement = <ParentElement extends VCanvas | VNode>(
  parentElementName: VElementName,
  initialElement: Element
) => {
  let { parentElement: element } = initialElement;
  while (element) {
    if (element.localName == parentElementName) return element as ParentElement;
    element = element.parentElement;
  }
  throw new Error(
    `Parent element ${parentElementName} not found for element ${initialElement}`
  );
};

/**
 * Normalize uid value.
 *
 * @internal
 */
const normalizeUid = (uid: string) => uid.trim();

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
 *   <slot></slot>
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
 * Calculates the coordinates of a pointer event, relative to a DOM element.
 *
 * @internal
 */
const pointerCoordinates = (
  { clientX, clientY }: MouseEvent,
  { left, top }: DOMRect
): Vector => ({ x: Math.round(clientX - left), y: Math.round(clientY - top) });

/**
 * Coerce a value to a positive integer.
 *
 * @internal
 */
const coerceToNatural = (value: unknown): number | undefined => {
  const num = Number(value);
  if (isNaN(num)) return;
  if (num < 1) return;
  return Math.round(num);
};

/**
 * All custom elements observed attributes.
 *
 * @internal
 */
const observedAttributes: Record<
  Exclude<VElementName, "v-col" | "v-row">,
  string[]
> = {
  "v-canvas": ["unit"],
  "v-pin": ["uid"],
  "v-label": ["text"],
  "v-node": ["xy"],
  "v-edge": ["path"]
};

/**
 * All custom elements event types.
 *
 * @internal
 */
const eventTypes = {
  "v-canvas": [
    "pointercancel",
    "pointerdown",
    "pointerleave",
    "pointermove",
    "pointerup",
    "wheel"
  ],
  "v-node": ["pointerdown"]
} satisfies Record<
  Extract<VElementName, "v-canvas" | "v-node">,
  Array<keyof GlobalEventHandlersEventMap>
>;

/**
 * All custom elements templates.
 *
 * @internal
 */
const template: Record<VElementName, HTMLTemplateElement> = {
  "v-canvas": html`
    <style>
      :host {
        font-family: var(
          --flow-view-font-family,
          system-ui,
          Roboto,
          sans-serif
        );
        --font-size: calc(var(--unit) * 1.6);
        font-size: var(--font-size);

        --transition: 200ms ease-in-out;

        --background-color: var(--flow-view-background-color, #fefefe);
        color: var(--flow-view-text-color, #121212);

        @media (prefers-color-scheme: dark) {
          --background-color: var(--flow-view-background-color, #555);
          color: var(--flow-view-text-color, #ccc);
        }

        background-color: var(--background-color);
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

  "v-col": html`
    <style>
      :host {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: var(--unit);
        min-width: var(--unit);
      }
    </style>
    <slot></slot>
  `,

  "v-row": html`
    <style>
      :host {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: var(--unit);
        min-height: var(--unit);
      }
    </style>
    <slot></slot>
  `,

  "v-node": html`
    <style>
      :host {
        position: absolute;
        left: calc(var(--unit) * var(--x) - var(--unit) * var(--origin-x));
        top: calc(var(--unit) * var(--y) - var(--unit) * var(--origin-y));
        background-color: var(--background-color);
        border-radius: calc(var(--unit) * 0.85);
        padding: calc(var(--unit) * 0.2);
        border: 1px solid;
        transition: all var(--transition);
        display: flex;
        flex-direction: column;
      }
    </style>
    <slot></slot>
  `,

  "v-edge": html`
    <style>
      :host {
        position: absolute;
        display: var(--display-edges);
        left: var(--left);
        top: var(--top);
        width: var(--width, 10px);
        height: var(--height, 10px);
        border: 1px solid;
      }
    </style>
  `,

  "v-pin": html`
    <style>
      :host {
        display: block;
        width: var(--unit);
        height: var(--unit);
        border-radius: 50%;
        background-color: currentColor;
        opacity: 0.7;
        transition: all var(--transition);
      }
      :host(:hover) {
        opacity: 1;
      }
    </style>
  `,

  "v-label": html`
    <style>
      :host {
        font-size: var(--font-size);
        padding-inline: var(--unit);
        user-select: none;
      }
    </style>
  `
};

/** A stack of elements displayed in a column. */
class VCol extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.appendChild(template["v-col"].content.cloneNode(true));
  }
}

/** A stack of elements displayed in a row. */
class VRow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.appendChild(template["v-row"].content.cloneNode(true));
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
 * <v-canvas>
 *   <v-node x="10" y="10">Hello</v-node>
 * </v-canvas>
 * ```
 *
 * @internal
 */
class VCanvas extends HTMLElement {
  #cssProps = document.createElement("style");

  /**
   * The canvas unit expressed in pixels.
   *
   * @internal
   */
  #unit = 10;

  /**
   * Check if a value is a valid unit.
   *
   * @internal
   */
  #isValidUnit(value: number): value is number {
    return value > 1 && value < 25;
  }

  #allPinsAreRegistered = false;

  #edgeMap = new Map<string, VEdge>();

  #pinMap = new Map<string, VPin>();

  #origin: Vector = { x: 0, y: 0 };

  /**
   * Edges need to wait all pins are registered before rendering.
   *
   * @remarks
   * It modifies the --display-edges CSS prop.
   * @internal
   */
  #showEdges = false;

  /**
   * It holds the info needed for translating the canvas items.
   *
   * @internal.
   */
  #translation = {
    isActive: false,
    origin: { x: 0, y: 0 },
    start: { x: 0, y: 0 }
  };

  /**
   * It keeps the uids unique.
   *
   * @internal.
   */
  #uidSet = new Set<string>();

  /**
   * An SVG layer which size is same as the canvas DOM content.
   *
   * @internal
   */
  #svg = createElementSvg("svg");

  #mutationObserver = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        console.log("TODO A child node has been added or removed.");
        console.log(mutation);
      }
      if (mutation.type === "attributes") {
        console.log(
          `TODO The ${mutation.attributeName} attribute was modified.`
        );
      }
    }
  });

  /**
   * Sync the SVG layer size with the canvas size.
   *
   * @internal
   */
  #resizeObserver = new ResizeObserver((entries) => {
    for (const {
      contentBoxSize: [{ blockSize, inlineSize }]
    } of entries.filter((entry) => entry.target === this)) {
      const width = Math.round(inlineSize);
      const height = Math.round(blockSize);
      const {
        origin: { x, y },
        unit
      } = this;
      const svg = this.#svg;
      svg.setAttribute("width", `${width}`);
      svg.setAttribute("height", `${height}`);
      svg.setAttribute("viewBox", `${x * unit} ${y * unit} ${width} ${height}`);
    }
  });

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const root = template["v-canvas"].content.cloneNode(true);
    this.#setCssProps();
    root.insertBefore(this.#cssProps, root.firstChild);
    root.appendChild(this.#svg);
    this.shadowRoot!.appendChild(root);
  }

  static get observedAttributes() {
    return observedAttributes["v-canvas"];
  }

  attributeChangedCallback(
    name: (typeof observedAttributes)["v-canvas"][number],
    _oldValue: string | null,
    newValue: string | null
  ) {
    // TODO check origin (similar to VNode's xy)
    if (name == "unit") {
      const value = coerceToNatural(newValue);
      if (!value || !this.#isValidUnit(value) || value == this.#unit) return;
      this.#unit = value;
      this.#setCssProps();
    }
  }

  connectedCallback() {
    this.#mutationObserver.observe(this, {
      attributes: true,
      childList: true,
      subtree: true
    });

    this.#resizeObserver.observe(this);

    eventTypes["v-canvas"].forEach((eventType) => {
      this.addEventListener(eventType, this);
    });
  }

  disconnectedCallback() {
    this.#mutationObserver.disconnect();
    this.#resizeObserver.unobserve(this);
  }

  handleEvent(
    event: GlobalEventHandlersEventMap[(typeof eventTypes)["v-canvas"][number]]
  ) {
    if (event instanceof PointerEvent && event.target == this) {
      const { type } = event;
      if (["pointercancel", "pointerleave"].includes(type))
        this.#stopTranslation();

      if (type == "pointerdown")
        this.#startTranslation(
          pointerCoordinates(event, this.getBoundingClientRect())
        );

      if (type == "pointermove" && this.#translation.isActive) {
        // TODO change cursor to 'grab' when translating
        const pointer = pointerCoordinates(event, this.getBoundingClientRect());
        const x =
          this.#translation.origin.x +
          Math.round((this.#translation.start.x - pointer.x) / this.#unit);
        const y =
          this.#translation.origin.y +
          Math.round((this.#translation.start.y - pointer.y) / this.#unit);
        if (x != this.#origin.x || y != this.#origin.y) {
          this.#origin = { x, y };
          this.#setCssProps();
        }
      }

      if (type == "pointerup") this.#stopTranslation();
    }

    if (event instanceof WheelEvent && event.target != this) {
      event.preventDefault();
      const { origin, unit: currentUnit } = this;
      const unit = currentUnit - Math.round(event.deltaY / currentUnit);
      if (!unit || !this.#isValidUnit(unit) || unit == this.#unit) return;
      const pointer = pointerCoordinates(event, this.getBoundingClientRect());
      this.#origin = {
        x:
          origin.x -
          Math.round(pointer.x / unit) +
          Math.round(pointer.x / currentUnit),
        y:
          origin.y -
          Math.round(pointer.y / unit) +
          Math.round(pointer.y / currentUnit)
      };
      this.#unit = unit;
      // TODO this.setAttribute('unit', `${unit}`)
      this.#setCssProps();
    }
  }

  #setCssProps() {
    this.#cssProps.innerHTML = `
      :host {
        --origin-x: ${this.#origin.x};
        --origin-y: ${this.#origin.y};
        --unit: ${this.#unit}px;
        --display-edges: ${this.#showEdges ? "block" : "none"};
      }`;
  }

  #startTranslation(start: Vector) {
    this.#translation.start = start;
    this.#translation.origin = this.#origin;
    this.#translation.isActive = true;
  }

  #stopTranslation() {
    this.#translation.isActive = false;
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
   * Get current origin in canvas coordinates.
   *
   * @internal
   */
  get origin(): Vector {
    return this.#origin;
  }

  /**
   * Get current unit.
   *
   * @internal
   */
  get unit() {
    return this.#unit;
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
   * Register the given edge.
   *
   * @internal
   */
  registerEdge(edge: VEdge) {
    console.log("register", edge);
    this.#edgeMap.set(edge.uid, edge);
    if (!this.#showEdges) return;
    edge.updateGeometry();
  }

  /**
   * Unregister the given edge.
   *
   * @internal
   */
  unregisterEdge(edge: VEdge) {
    this.#edgeMap.delete(edge.uid);
  }

  /**
   * Register the given pin.
   *
   * @internal
   */
  registerPin(pin: VPin) {
    this.#pinMap.set(pin.uid, pin);
    if (this.#allPinsAreRegistered) return;
    for (const pinElement of this.querySelectorAll("v-pin")) {
      const uid = pinElement.getAttribute("uid");
      if (!uid) continue;
      if (!this.#pinMap.has(uid)) return;
    }
    this.#allPinsAreRegistered = true;
    console.log("xx", this.#edgeMap);
    // All pins are registered here, edges can render.
    this.#showEdges = true;
    this.#setCssProps();
    for (const edge of this.#edgeMap.values()) edge.updateGeometry();
  }

  /**
   * Unregister the given pin.
   *
   * @internal
   */
  unregisterPin(pin: VPin) {
    this.#pinMap.delete(pin.uid);
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

  // TODO remove
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
    this.#svg.appendChild(group);
  }

  /**
   * Get pin by its uid, if any.
   *
   * @internal
   */
  getPinElementByUid(uid: string): VPin | undefined {
    if (this.#pinMap.has(uid)) return this.#pinMap.get(uid);
  }
}

/**
 * A pin is the start or the end of an edge.
 *
 * @internal
 */
class VPin extends HTMLElement {
  /**
   * Unique identifier
   *
   * @internal
   */
  #uid = "";

  #node: VNode | undefined;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.appendChild(template["v-pin"].content.cloneNode(true));
  }

  static get observedAttributes() {
    return observedAttributes["v-pin"];
  }

  attributeChangedCallback(
    name: (typeof observedAttributes)["v-pin"][number],
    _oldValue: string | null,
    newValue: string | null
  ) {
    // Once the uid is registered on connect, it is a readonly value.
    if (name == "uid") {
      const uid = this.#uid;
      if (uid && newValue != uid) this.setAttribute("uid", uid);
    }
  }

  connectedCallback() {
    const canvas = this.node.canvas;
    // Use given uid or create a new one to register the pin.
    const uidValue = this.getAttribute("uid") ?? canvas.createUid();
    const normalizedUid = normalizeUid(uidValue);
    const success = canvas.registerUid(normalizedUid);
    if (success) {
      this.#uid = normalizedUid;
      canvas.registerPin(this);
      if (normalizedUid != uidValue) this.setAttribute("uid", normalizedUid);
    } else {
      const newUid = canvas.createUid();
      this.#uid = newUid;
      canvas.registerPin(this);
      this.setAttribute("uid", newUid);
    }
  }

  disconnectedCallback() {
    this.node.canvas.unregisterPin(this);
  }

  /**
   * The pin size.
   *
   * @internal
   */
  get size() {
    return this.node.canvas.unit;
  }

  /**
   * The top left coordinates.
   *
   * @internal
   */
  get position(): Vector {
    return {
      x: this.node.offsetLeft + this.offsetLeft,
      y: this.node.offsetTop + this.offsetTop
    };
  }

  /**
   * The coordinates of the pin center in pixels.
   *
   * @internal
   */
  get center(): Vector {
    const { position, size } = this;
    return {
      x: position.x + size / 2,
      y: position.y + size / 2
    };
  }

  /**
   * Get the node where the pin is contained.
   *
   * @internal
   */
  private get node(): VNode {
    if (this.#node) return this.#node;
    try {
      return (this.#node = findParentElement<VNode>("v-node", this));
    } catch (error) {
      this.remove();
      throw error;
    }
  }

  /**
   * A pin has an identifier that is unique in the canvas that contains it.
   *
   * @remarks
   * The uid value is synced with the corresponding DOM attribute.
   * @internal
   */
  get uid(): string {
    return this.#uid;
  }
}

/**
 * A node can contain pins.
 *
 * @internal
 */
class VNode extends HTMLElement {
  static eventTypes = ["pointerdown"] satisfies Array<
    keyof GlobalEventHandlersEventMap
  >;
  #canvas: VCanvas | undefined;
  #cssProps = document.createElement("style");
  #position: Vector = { x: 0, y: 0 };

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const root = template["v-node"].content.cloneNode(true);
    this.#setCssProps();
    root.insertBefore(this.#cssProps, root.firstChild);
    this.shadowRoot!.appendChild(root);
  }

  static get observedAttributes() {
    return observedAttributes["v-node"];
  }

  attributeChangedCallback(
    name: (typeof observedAttributes)["v-node"][number],
    _oldValue: string | null,
    newValue: string | null
  ) {
    // Handle a position change.
    if (name == "xy") {
      if (newValue === null) {
        this.position = { x: 0, y: 0 };
        return;
      }
      const [x, y] = newValue.split(",").map((value) => parseInt(value));
      if (isNaN(x) || isNaN(y)) {
        this.setAttribute(name, "0,0");
        return;
      }
      this.position = { x, y };
    }
  }

  connectedCallback() {
    eventTypes["v-node"].forEach((eventType) => {
      this.addEventListener(eventType, this);
    });
  }

  handleEvent(
    event: GlobalEventHandlersEventMap[(typeof eventTypes)["v-node"][number]]
  ) {
    if (event.type == "pointerdown") {
      // Move the node on top.
      // Notice that appendChild will not clone the node, it will move it at the end of the list.
      // Also, here the parentElement could be the v-canvas: in any case there is at least a v-canvas containing the node.
      this.parentElement!.appendChild(this);
    }
  }

  #setCssProps() {
    this.#cssProps.innerHTML = `
      :host {
        --x: ${this.position.x};
        --y: ${this.position.y};
      }`;
  }

  /**
   * Get the canvas where the node is rendered.
   *
   * @internal
   */
  get canvas(): VCanvas {
    if (this.#canvas) return this.#canvas;
    try {
      return (this.#canvas = findParentElement<VCanvas>("v-canvas", this));
    } catch (error) {
      this.remove();
      throw error;
    }
  }

  /**
   * Get current position.
   *
   * @internal
   */
  get position() {
    return this.#position;
  }

  /**
   * Set position and update related CSS props.
   *
   * @internal
   */
  set position({ x, y }: Vector) {
    if (x == this.#position.x && y == this.#position.y) return;
    this.#position = { x, y };
    this.#setCssProps();
  }
}

/**
 * An edge connects a list of two or more pins.
 *
 * @internal
 */
class VEdge extends HTMLElement {
  /**
   * Unique identifier
   *
   * @internal
   */
  #uid = "";

  #canvas: VCanvas | undefined;

  /**
   * A list of uids to connect.
   *
   * @remarks
   * It is synced with path DOM attribute.
   * @internal
   */
  #path: string[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.appendChild(template["v-edge"].content.cloneNode(true));
  }

  static get observedAttributes() {
    return observedAttributes["v-edge"];
  }

  attributeChangedCallback(
    name: (typeof observedAttributes)["v-edge"][number],
    _oldValue: string | null,
    newValue: string | null
  ) {
    if (name === "path") {
      if (!newValue) return;
      // Get only the pin uids that reference a pin.
      const uids = newValue.split(",").map(normalizeUid);
      // Check that path is normalize or reset it.
      const normalizePath = uids.join();
      if (normalizePath != newValue) {
        this.setAttribute("path", normalizePath);
        return;
      }
      // An edge connects at least two pins.
      if (uids.length < 2) {
        this.removeAttribute("path");
        return;
      }
      // Update path.
      this.#path = uids;
    }
  }

  connectedCallback() {
    const { canvas } = this;
    // Create a new uid and register the edge.
    this.#uid = canvas.createUid();
    canvas.registerEdge(this);
  }

  disconnectedCallback() {
    this.canvas.unregisterEdge(this);
  }

  /**
   * Get the canvas where the edge is rendered.
   *
   * @internal
   */
  get canvas(): VCanvas {
    if (this.#canvas) return this.#canvas;
    try {
      return (this.#canvas = findParentElement<VCanvas>("v-canvas", this));
    } catch (error) {
      this.remove();
      throw error;
    }
  }

  /**
   * An edge has an identifier that is unique in the canvas that contains it.
   *
   * @internal
   */
  get uid(): string {
    return this.#uid;
  }

  updateGeometry() {
    const { canvas } = this;
    for (const uid of this.#path) {
      console.log(canvas.getPinElementByUid(uid));
    }
  }
}

/**
 * Display inline text.
 *
 * @internal
 */
class VLabel extends HTMLElement {
  readonly textNode = document.createTextNode("");
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const root = template["v-label"].content.cloneNode(true);
    root.appendChild(this.textNode);
    this.shadowRoot!.appendChild(root);
  }

  static get observedAttributes() {
    return observedAttributes["v-label"];
  }

  attributeChangedCallback(
    name: (typeof observedAttributes)["v-label"][number],
    _oldValue: string | null,
    newValue: string | null
  ) {
    if (name == "text") {
      this.textNode.textContent = newValue;
    }
  }
}

/**
 * All HTML elements.
 *
 * @remark Order matters, an element could depend on another element to be defined.
 *
 * @internal
 */
const htmlElements: Array<[VElementName, typeof HTMLElement]> = [
  ["v-canvas", VCanvas],
  ["v-node", VNode],
  ["v-pin", VPin],
  ["v-edge", VEdge],
  ["v-label", VLabel],
  ["v-row", VRow],
  ["v-col", VCol]
];

/**
 * Define HTML custom elements v-canvas, v-node, v-edge, etc.
 *
 * @example
 *
 * ```ts
 * import { defineFlowViewCustomElements } from "flow-view";
 *
 * addEventListener("load", () => {
 *   defineFlowViewCustomElements();
 * });
 * ```
 */
export const defineFlowViewCustomElements = () => {
  for (const [elementName, ElementClass] of htmlElements)
    if (!window.customElements.get(elementName))
      window.customElements.define(elementName, ElementClass);
};
