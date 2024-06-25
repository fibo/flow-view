const createElementSvg = document.createElementNS.bind(document, "http://www.w3.org/2000/svg");
const findCanvas = (initialElement) => {
    let { parentElement: element } = initialElement;
    while (element) {
        if (element.tagName == "V-CANVAS")
            return element;
        element = element.parentElement;
    }
};
const findNode = (initialElement) => {
    let { parentElement: element } = initialElement;
    while (element) {
        if (element.tagName == "V-NODE")
            return element;
        element = element.parentElement;
    }
};
class ErrorCanvasNotFound extends Error {
    constructor() {
        super("v-canvas not found");
    }
}
class ErrorNodeNotFound extends Error {
    constructor() {
        super("v-node not found");
    }
}
const html = (strings, ...expressions) => {
    const template = document.createElement("template");
    template.innerHTML = strings.reduce((result, string, index) => result + string + (expressions[index] ?? ""), "");
    return template;
};
const pointerCoordinates = ({ clientX, clientY }, { left, top }) => {
    return { x: Math.round(clientX - left), y: Math.round(clientY - top) };
};
const obervedAttributes = {
    "v-canvas": ["unit"],
    "v-pin": ["uid"],
    "v-label": ["text"],
    "v-node": ["xy"],
    "v-edge": ["pins"]
};
const template = {
    "v-canvas": html `
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

        --transition: var(--flow-view-transition, 200ms ease-in-out);

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
    "v-col": html `
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
    "v-row": html `
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
    "v-node": html `
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
    "v-pin": html `
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
    "v-label": html `
    <style>
      :host {
        font-size: var(--font-size);
        padding-inline: var(--unit);
        user-select: none;
      }
    </style>
  `
};
class VCol extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template["v-col"].content.cloneNode(true));
    }
}
class VRow extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template["v-row"].content.cloneNode(true));
    }
}
class VCanvas extends HTMLElement {
    #cssProps = document.createElement("style");
    #isDragging = false;
    #unit = 10;
    #edgeMap = new Map();
    #pinMap = new Map();
    #segmentsMap = new Map();
    #origin = { x: 0, y: 0 };
    #startDragPoint = { x: 0, y: 0 };
    #uidSet = new Set();
    svg = createElementSvg("svg");
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        const root = template["v-canvas"].content.cloneNode(true);
        this.#setCssProps();
        root.insertBefore(this.#cssProps, root.firstChild);
        root.appendChild(this.svg);
        this.shadowRoot.appendChild(root);
    }
    static get observedAttributes() {
        return obervedAttributes["v-canvas"];
    }
    attributeChangedCallback(name, _oldValue, newValue) {
        if (name == "unit") {
            if (!newValue)
                return;
            const num = Number(newValue);
            if (isNaN(num))
                return;
            this.style.setProperty("--unit", `${num}px`);
        }
    }
    connectedCallback() {
        new ResizeObserver(this.resizeObserverCallback).observe(this);
        this.addEventListener("pointerdown", this);
        this.addEventListener("pointerleave", this);
        this.addEventListener("pointermove", this);
    }
    handleEvent(event) {
        if (event.type == "pointerdown" && event.target == this) {
            if (this.#isDragging) {
                this.#stopDrag(event);
            }
            else {
                this.#startDrag(event);
            }
            console.log("clc");
        }
        if (event.type == "pointerleave" && event.target == this) {
            console.log("leave");
            this.#stopDrag(event);
        }
        if (event.type == "pointermove" && event.target == this) {
            if (this.#isDragging) {
                const currentX = Number(this.getAttribute("x")) ?? 0;
                const { x, y } = pointerCoordinates(event, this.getBoundingClientRect());
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
    #setCssProps() {
        this.#cssProps.innerHTML = `
      :host {
        --origin-x: ${this.#origin.x};
        --origin-y: ${this.#origin.y};
        --unit: ${this.#unit}px;
      }`;
    }
    #startDrag(event) {
        const { x, y } = pointerCoordinates(event, this.getBoundingClientRect());
        this.#startDragPoint = { x, y };
        console.log("start drag", x, y);
        this.#isDragging = true;
    }
    #stopDrag(event) {
        const { x, y } = pointerCoordinates(event, this.getBoundingClientRect());
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
    createUid() {
        const uid = this.#newUid();
        this.#uidSet.add(uid);
        return uid;
    }
    setEdge(edge) {
        const pins = edge.pins
            .split(",")
            .map((uid) => this.#pinMap.get(uid))
            .filter((pin) => !!pin);
        for (let i = 0; i < pins.length - 1; i++) {
            const start = pins[i];
            const end = pins[i + 1];
            setTimeout(() => {
                this.createLine(start.center, end.center);
            }, 1000);
        }
    }
    setPin(pin) {
        this.#pinMap.set(pin.uid, pin);
    }
    registerUid(uid) {
        if (this.#uidSet.has(uid))
            return false;
        this.#uidSet.add(uid);
        return true;
    }
    createLine(start, end) {
        const r = "2", x1 = `${start.x}`, y1 = `${start.y}`, x2 = `${end.x}`, y2 = `${end.y}`;
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
    get resizeObserverCallback() {
        return (entries) => {
            entries
                .filter((entry) => entry.target === this)
                .forEach(({ contentBoxSize: [boxSize] }) => {
                const { origin, svg } = this;
                const x = Math.floor(boxSize.inlineSize), y = Math.floor(boxSize.blockSize);
                svg.setAttribute("width", `${x}`);
                svg.setAttribute("height", `${y}`);
                svg.setAttribute("viewBox", `${origin.x} ${origin.y} ${x} ${y}`);
            });
        };
    }
    get origin() {
        return { x: this.#origin.x, y: this.#origin.y };
    }
    set origin({ x, y }) {
        if (x == this.#origin.x && y == this.#origin.y)
            return;
        this.#origin = { x, y };
        this.#setCssProps();
    }
    get unit() {
        return this.#unit;
    }
    set unit(value) {
        if (value == this.#unit)
            return;
        this.#unit = value;
        this.#setCssProps();
    }
    getPinElementByUid(uid) {
        if (this.#pinMap.has(uid))
            return this.#pinMap.get(uid);
    }
}
class VPin extends HTMLElement {
    #node;
    #uid = "";
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template["v-pin"].content.cloneNode(true));
    }
    static get observedAttributes() {
        return obervedAttributes["v-pin"];
    }
    attributeChangedCallback(name, _oldValue, newValue) {
        if (name == "uid") {
            const uid = this.#uid;
            if (uid && newValue != uid)
                this.setAttribute("uid", uid);
        }
    }
    connectedCallback() {
        const { canvas } = this;
        const uidValue = this.getAttribute("uid");
        if (uidValue) {
            const normalizedUid = uidValue.trim();
            const success = canvas.registerUid(normalizedUid);
            if (success) {
                this.#uid = normalizedUid;
                canvas.setPin(this);
                if (normalizedUid != uidValue)
                    this.setAttribute("uid", normalizedUid);
            }
            else {
                const newUid = canvas.createUid();
                this.#uid = newUid;
                this.setAttribute("uid", newUid);
                canvas.setPin(this);
            }
        }
    }
    get canvas() {
        const canvas = this.node.canvas;
        if (!canvas) {
            this.remove();
            throw new ErrorCanvasNotFound();
        }
        return canvas;
    }
    get center() {
        return {
            x: this.node.offsetLeft + this.offsetLeft + this.halfSize,
            y: this.node.offsetTop + this.offsetTop + this.halfSize
        };
    }
    get node() {
        if (this.#node)
            return this.#node;
        const node = findNode(this);
        if (!node) {
            this.remove();
            throw new ErrorNodeNotFound();
        }
        return (this.#node = node);
    }
    get halfSize() {
        return this.canvas.unit / 2;
    }
    get uid() {
        return this.#uid;
    }
}
class VNode extends HTMLElement {
    #canvas;
    #cssProps = document.createElement("style");
    #position = { x: 0, y: 0 };
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        const root = template["v-node"].content.cloneNode(true);
        this.#setCssProps();
        root.insertBefore(this.#cssProps, root.firstChild);
        this.shadowRoot.appendChild(root);
    }
    static get observedAttributes() {
        return obervedAttributes["v-node"];
    }
    attributeChangedCallback(name, _oldValue, newValue) {
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
        this.addEventListener("pointerdown", this);
    }
    handleEvent(event) {
        if (event.type == "pointerdown") {
            this.parentElement.appendChild(this);
        }
    }
    #setCssProps() {
        this.#cssProps.innerHTML = `
      :host {
        --x: ${this.position.x};
        --y: ${this.position.y};
      }`;
    }
    get canvas() {
        if (this.#canvas)
            return this.#canvas;
        const canvas = findCanvas(this);
        if (!canvas) {
            this.remove();
            throw new ErrorCanvasNotFound();
        }
        return (this.#canvas = canvas);
    }
    get position() {
        return this.#position;
    }
    set position({ x, y }) {
        if (x == this.#position.x && y == this.#position.y)
            return;
        this.#position = { x, y };
        this.#setCssProps();
    }
}
class VEdge extends HTMLElement {
    #canvas;
    constructor() {
        super();
    }
    static get observedAttributes() {
        return obervedAttributes["v-edge"];
    }
    attributeChangedCallback(name, _oldValue, newValue) {
        if (name === "pins") {
            if (!newValue)
                return;
            const pinUids = newValue.split(",").map((uid) => uid.trim());
            if (pinUids.length < 2) {
                this.removeAttribute("pins");
                return;
            }
            this.canvas.setEdge(this);
        }
    }
    get canvas() {
        if (this.#canvas)
            return this.#canvas;
        const canvas = findCanvas(this);
        if (!canvas) {
            this.remove();
            throw new ErrorCanvasNotFound();
        }
        return (this.#canvas = canvas);
    }
    get pins() {
        return this.getAttribute("pins") ?? "";
    }
}
class VLabel extends HTMLElement {
    textNode = document.createTextNode("");
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        const root = template["v-label"].content.cloneNode(true);
        root.appendChild(this.textNode);
        this.shadowRoot.appendChild(root);
    }
    static get observedAttributes() {
        return obervedAttributes["v-label"];
    }
    attributeChangedCallback(name, _oldValue, newValue) {
        if (name == "text") {
            this.textNode.textContent = newValue;
        }
    }
}
const htmlElements = [
    ["v-canvas", VCanvas],
    ["v-node", VNode],
    ["v-pin", VPin],
    ["v-edge", VEdge],
    ["v-label", VLabel],
    ["v-row", VRow],
    ["v-col", VCol]
];
export const defineFlowViewCustomElements = () => {
    for (const [elementName, ElementClass] of htmlElements)
        if (!window.customElements.get(elementName))
            window.customElements.define(elementName, ElementClass);
};
