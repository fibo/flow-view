/**
 * All custom elements tag names.
 *
 * @internal
 */
type TagName = "v-canvas" | "v-edge" | "v-node" | "v-pin" | "v-label";

/**
 * A vector in 2d space.
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

/** @internal */
class ErrorNodeNotFound extends Error {
  constructor() {
    super("v-node not found");
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

const pointerCoordinates = (
  { clientX, clientY }: PointerEvent,
  { left, top }: DOMRect
): Vector => {
  return { x: Math.round(clientX - left), y: Math.round(clientY - top) };
};

/**
 * All custom elements observed attributes.
 *
 * @internal
 */
const obervedAttributes: Record<TagName, string[]> = {
  "v-canvas": ["unit"],
  "v-pin": ["uid"],
  "v-label": ["text"],
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
        --font-size: calc(var(--unit) * 1.6);
        font-size: var(--font-size);

        --transition: var(--flow-view-transition, 200ms ease-in-out);

        --background-color: var(--flow-view-background-color, #fefefe);
        color: var(--flow-view-text-color, #121212);

        @media (prefers-color-scheme: dark) {
          --background-color: var(--flow-view-background-color, #555);
          color: var(--flow-view-text-color, #ccc);
        }

        --origin-x: 0;

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

  "v-node": html`
    <style>
      :host {
        position: absolute;
        --x: 0;
        --y: 0;
        left: calc(var(--unit) * var(--x) - var(--unit) * var(--origin-x));
        top: calc(var(--unit) * var(--y));
        background-color: var(--background-color);
        border-radius: calc(var(--unit) * 0.85);
        padding: calc(var(--unit) * 0.2);
        border: 1px solid;
        transition: all var(--transition);
        display: flex;
        flex-direction: column;
      }
      .pins {
        min-height: var(--unit);
      }
      ::slotted(div:is([slot="ins"], [slot="outs"])) {
        display: flex;
        justify-content: space-between;
        gap: var(--unit);
      }
    </style>
    <div class="pins"><slot name="ins"></slot></div>
    <slot></slot>
    <div class="pins"><slot name="outs"></slot></div>
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
  #isDragging = false;
  #edgeMap = new Map<Set<string>, VEdge>();
  #pinMap = new Map<string, VPin>();
  #segmentsMap = new Map<string, string>();
  #origin: Vector = { x: 0, y: 0 };
  #startDragPoint: Vector = { x: 0, y: 0 };
  #uidSet = new Set<string>();
  readonly svg = createElementSvg("svg");

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const root = template["v-canvas"].content.cloneNode(true);
    root.appendChild(this.svg);
    this.shadowRoot!.appendChild(root);
  }

  static get observedAttributes() {
    return obervedAttributes["v-canvas"];
  }

  attributeChangedCallback(
    name: (typeof obervedAttributes)["v-canvas"][number],
    _oldValue: string | null,
    newValue: string | null
  ) {
    // TODO check x, y (similar to VNode)
    if (name == "unit") {
      if (!newValue) return;
      const num = Number(newValue);
      if (isNaN(num)) return;
      this.style.setProperty("--unit", `${num}px`);
    }
  }

  connectedCallback() {
    new ResizeObserver(this.resizeObserverCallback).observe(this);

    this.addEventListener("pointerdown", this);
    this.addEventListener("pointerleave", this);
    this.addEventListener("pointermove", this);
  }

  handleEvent(event: Event) {
    if (event.type == "pointerdown" && event.target == this) {
      if (this.#isDragging) {
        this.#stopDrag(event);
      } else {
        this.#startDrag(event);
      }
      console.log("clc");
    }

    if (event.type == "pointerleave" && event.target == this) {
      console.log("leave");
      this.#stopDrag(event);
    }

    if (event.type == "pointermove" && event.target == this) {
      // if (this.#isDragging) console.log("move");
      if (this.#isDragging) {
        const currentX = Number(this.getAttribute("x")) ?? 0;
        const { x, y } = pointerCoordinates(
          event as PointerEvent,
          this.getBoundingClientRect()
        );
        console.log("currentX", currentX);
        console.log(this.#startDragPoint.x - x);
        this.origin = {
          x: Math.floor(this.origin.x + (this.#startDragPoint.x - x) / 10),
          y: this.origin.y
        };
        this.setAttribute("x", `${this.#startDragPoint.x - x}`);
        this.style.setProperty("--x", `${this.#startDragPoint.x - x}`);
      }
    }
  }

  #startDrag(event: Event) {
    const { x, y } = pointerCoordinates(
      event as PointerEvent,
      this.getBoundingClientRect()
    );
    this.#startDragPoint = { x, y };
    console.log("start drag", x, y);
    this.#isDragging = true;
  }

  #stopDrag(event: Event) {
    const { x, y } = pointerCoordinates(
      event as PointerEvent,
      this.getBoundingClientRect()
    );
    console.log("stop drag", x, y);
    this.#isDragging = false;
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

  /** Set the given edge. @internal */
  setEdge(edge: VEdge) {
    const pins = edge.pins
      .split(",")
      .map((uid) => this.#pinMap.get(uid))
      .filter((pin) => !!pin) as VPin[];
    for (let i = 0; i < pins.length - 1; i++) {
      const start = pins[i];
      const end = pins[i + 1];
      // TODO improve this
      // is setEdge is called on connect, pins may not get the right data from the DOM
      setTimeout(() => {
        this.createLine(start.center, end.center);
      }, 1000);
    }
    // this.#edgeMap.set(new Set(pins), edge);
  }

  /** Set the given pin. @internal */
  setPin(pin: VPin) {
    this.#pinMap.set(pin.uid, pin);
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

  get unit() {
    return getComputedStyle(this).getPropertyValue("--unit");
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
    return { x: this.#origin.x, y: this.#origin.y };
  }

  /** @internal */
  set origin({ x, y }: Vector) {
    if (x == this.#origin.x && y == this.#origin.y) return;
    if (x != this.#origin.x) this.style.setProperty("--origin-x", `${x}`);
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
  #node: VNode | undefined;
  #uid = "";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.appendChild(template["v-pin"].content.cloneNode(true));
  }

  static get observedAttributes() {
    return obervedAttributes["v-pin"];
  }

  attributeChangedCallback(
    name: (typeof obervedAttributes)["v-node"][number],
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
    const { canvas } = this;
    // Use given uid or create a new one to register the pin.
    const uidValue = this.getAttribute("uid");
    if (uidValue) {
      const normalizedUid = uidValue.trim();
      const success = canvas.registerUid(normalizedUid);
      if (success) {
        this.#uid = normalizedUid;
        canvas.setPin(this);
        if (normalizedUid != uidValue) this.setAttribute("uid", normalizedUid);
      } else {
        const newUid = canvas.createUid();
        this.#uid = newUid;
        this.setAttribute("uid", newUid);
        canvas.setPin(this);
      }
    }
  }

  /**
   * Get the canvas where the pin is rendered.
   *
   * @internal
   */
  get canvas(): VCanvas {
    const canvas = this.node.canvas;
    if (!canvas) {
      this.remove();
      throw new ErrorCanvasNotFound();
    }
    return canvas;
  }

  /**
   * The coordinates of the pin center in pixels.
   *
   * @internal
   */
  get center(): Vector {
    return {
      x: this.node.offsetLeft + this.offsetLeft + this.halfSize,
      y: this.node.offsetTop + this.offsetTop + this.halfSize
    };
  }

  /**
   * Get the node where the pin is contained.
   *
   * @internal
   */
  get node(): VNode {
    if (this.#node) return this.#node;
    const node = findNode(this);
    if (!node) {
      this.remove();
      throw new ErrorNodeNotFound();
    }
    return (this.#node = node);
  }

  /**
   * Get half of the pin size in pixels.
   *
   * @internal
   */
  get halfSize(): number {
    return Number(parseFloat(this.canvas.unit) / 2);
  }

  /**
   * A pin has an identifier that is unique in the v-canvas that contains it.
   *
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
      // Let the attribute to be removed. TODO handle better, should default to 0
      if (newValue === null) return;
      const newNum = parseInt(newValue);
      // Check the new value is a stringified integer.
      if (Number.isInteger(newNum)) {
        // If new value is a number but not exactly an integer,
        // set the attribute with a correct value.
        if (String(newNum) !== newValue) {
          this.setAttribute(name, String(newNum));
        } else {
          // Update node geometry.
          if (name === "x") this.style.setProperty("--x", newValue);
          if (name === "y") this.style.setProperty("--y", newValue);
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

  connectedCallback() {
    this.addEventListener("pointerdown", this);
  }

  handleEvent(event: Event) {
    if (event.type == "pointerdown") {
      // Move the node on top.
      // Notice that appendChild will not clone the node, it will move it at the end of the list.
      // Also, here the parentElement could be the v-canvas: in any case there is at least a v-canvas containing the node.
      this.parentElement!.appendChild(this);
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
      const pinUids = newValue.split(",").map((uid) => uid.trim());
      // An edge connects at least two pins.
      if (pinUids.length < 2) {
        this.removeAttribute("pins");
        return;
      }
      this.canvas.setEdge(this);
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
   * An edge is identified by its pin ids that are a comma separated value in
   * the pins attribute.
   *
   * @internal
   */
  get pins(): string {
    return this.getAttribute("pins") ?? "";
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
    return obervedAttributes["v-label"];
  }

  attributeChangedCallback(
    name: (typeof obervedAttributes)["v-label"][number],
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
const htmlElements: Array<[TagName, typeof HTMLElement]> = [
  ["v-canvas", VCanvas],
  ["v-node", VNode],
  ["v-pin", VPin],
  ["v-edge", VEdge],
  ["v-label", VLabel]
];

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
  for (const [elementName, ElementClass] of htmlElements)
    if (!window.customElements.get(elementName))
      window.customElements.define(elementName, ElementClass);
};
