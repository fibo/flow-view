/**
 * Util to create an SVG element.
 *
 * @example
 *
 * ```ts
 * const svg = createElementSvg('svg')
 *   .set('width', '100')
 *   .set('height', '100')
 * ```
 */
function createElementSvg(qualifiedName) {
  const element = document.createElementNS(
    'http://www.w3.org/2000/svg',
    qualifiedName
  )
  return Object.assign(element, {
    set: (attributeName, value) => {
      element.setAttribute(attributeName, value)
      return element
    }
  })
}

/** Look for the first parent element with the given name containing the element. */
function findParentElement( parentElementName, initialElement) {
  let { parentElement: element } = initialElement
  while (element) {
    if (element.localName == parentElementName) return element
    element = element.parentElement
  }
  throw new Error(
    `Parent element ${parentElementName} not found for element ${initialElement}`
  )
}

/** Normalize uid value. */
function normalizeUid(uid) {
  return uid.trim()
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
 * `
 * ```
 */
function html(strings, ...expressions) {
  const template = document.createElement('template')
  template.innerHTML = strings.reduce(
    (result, string, index) => result + string + (expressions[index] ?? ''),
    ''
  )
  return template
}

/** Calculates the coordinates of a pointer event, relative to a DOM element. */
function pointerCoordinates(
  { clientX, clientY },
  { left, top }
) {
  return { x: Math.round(clientX - left), y: Math.round(clientY - top) }
}

/** All custom elements observed attributes. */
const observedAttributes = {
  'v-canvas': [],
  'v-pin': ['uid'],
  'v-label': ['text'],
  'v-node': ['xy'],
  'v-edge': ['path']
}

/** All custom elements event types. */
const eventTypes = {
  'v-canvas': [
    'pointercancel',
    'pointerdown',
    'pointerleave',
    'pointermove',
    'pointerup'
  ],
  'v-node': ['pointerdown']
}

/** All custom elements templates. */
const template = {
  'v-canvas': html`
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
        cursor: var(--cursor);

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

  'v-col': html`
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

  'v-row': html`
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

  'v-node': html`
    <style>
      :host {
        position: absolute;
        left: calc(var(--unit) * var(--x) - var(--unit) * var(--origin-x));
        top: calc(var(--unit) * var(--y) - var(--unit) * var(--origin-y));
        background-color: var(--background-color);
        border-radius: calc(var(--unit) * 0.85);
        padding: calc(var(--unit) * 0.2);
        border: 1px solid;
        display: flex;
        flex-direction: column;
      }
    </style>
    <slot></slot>
  `,

  'v-edge': html`
    <style>
      :host {
        position: absolute;
        left: var(--left);
        top: var(--top);
        width: var(--width);
        height: var(--height);
      }
    </style>
  `,

  'v-pin': html`
    <style>
      :host {
        width: var(--unit);
        height: var(--unit);
        border-radius: 50%;
        background-color: currentColor;
        opacity: 0.7;
        transition: opacity var(--transition);
      }
      :host(:hover) {
        opacity: 1;
      }
    </style>
  `,

  'v-label': html`
    <style>
      :host {
        font-size: var(--font-size);
        padding-inline: var(--unit);
        user-select: none;
      }
    </style>
  `
}

class UidRegister {
  /** It keeps the uids unique. */
  #uidSet = new Set()

  #newUid(len = 2) {
    let uid = ''
    let alreadyExists = true
    while (alreadyExists) {
      uid = Math.random()
        .toString(36)
        .substring(2, 2 + len)
      alreadyExists = this.#uidSet.has(uid)
      len++
    }
    this.#uidSet.add(uid)
    return uid
  }

  /** Create a uid and register it. Return the created uid. */
  createUid() {
    const uid = this.#newUid()
    this.#uidSet.add(uid)
    return uid
  }

  /**
   * Register given uid.
   *
   * @remarks
   * Return a boolean according if the operation was successfull.
   */
  registerUid(uid) {
    if (!uid) return false
    if (this.#uidSet.has(uid)) return false
    this.#uidSet.add(uid)
    return true
  }

  /** Dispose uid. */
  unregisterUid(uid) {
    this.#uidSet.delete(uid)
  }
}

/** A stack of elements displayed in a column. */
class VCol extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template['v-col'].content.cloneNode(true))
  }
}

/** A stack of elements displayed in a row. */
class VRow extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template['v-row'].content.cloneNode(true))
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
 */
class VCanvas extends HTMLElement {
  #cssProps = document.createElement('style')

  /** The canvas unit expressed in pixels. */
  #unit = 10

  #isValidUnit(value) {
    return value > 1 && value < 25
  }

  #edgeSet = new Set()

  #pinMap = new Map()

  #origin = { x: 0, y: 0 }

  /** It holds the info needed for translating the canvas items. */
  #translation = {
    isActive: false,
    origin: { x: 0, y: 0 },
    start: { x: 0, y: 0 }
  }

  /** An SVG layer which size is same as the canvas DOM content. */
  #svg = createElementSvg('svg')

  #mutationObserver = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        console.log('TODO A child node has been added or removed.')
        console.log(mutation)
      }
      if (mutation.type === 'attributes') {
        console.log(
          `TODO The ${mutation.attributeName} attribute was modified.`
        )
      }
    }
  })

  /** Sync the SVG layer size with the canvas size. */
  #resizeObserver = new ResizeObserver((entries) => {
    for (const {
      contentBoxSize: [{ blockSize, inlineSize }]
    } of entries.filter((entry) => entry.target === this)) {
      const width = Math.round(inlineSize)
      const height = Math.round(blockSize)
      const {
        origin: { x, y },
        unit
      } = this
      this.#svg
        .set('width', `${width}`)
        .set('height', `${height}`)
        .set('viewBox', `${x * unit} ${y * unit} ${width} ${height}`)
    }
  })

  uidRegister = new UidRegister()

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const root = template['v-canvas'].content.cloneNode(true)
    this.#setCssProps()
    root.insertBefore(this.#cssProps, root.firstChild)
    root.appendChild(this.#svg)
    this.shadowRoot.appendChild(root)
  }

  connectedCallback() {
    this.#mutationObserver.observe(this, {
      attributes: true,
      childList: true,
      subtree: true
    })

    this.#resizeObserver.observe(this)

    eventTypes['v-canvas'].forEach((eventType) => {
      this.addEventListener(eventType, this)
    })
  }

  disconnectedCallback() {
    this.#mutationObserver.disconnect()
    this.#resizeObserver.unobserve(this)
  }

  handleEvent( event) {
    if (event instanceof PointerEvent && event.target == this) {
      const { type } = event
      if (['pointercancel', 'pointerleave'].includes(type))
        this.#stopTranslation()

      if (type == 'pointerdown')
        this.#startTranslation(
          pointerCoordinates(event, this.getBoundingClientRect())
        )

      if (type == 'pointermove' && this.#translation.isActive) {
        const pointer = pointerCoordinates(event, this.getBoundingClientRect())
        const x =
          this.#translation.origin.x +
          parseFloat(
            ((this.#translation.start.x - pointer.x) / this.#unit).toFixed(2)
          )
        const y =
          this.#translation.origin.y +
          parseFloat(
            ((this.#translation.start.y - pointer.y) / this.#unit).toFixed(2)
          )
        if (x != this.#origin.x || y != this.#origin.y) {
          this.#origin = { x, y }
          this.#setCssProps()
          this.#updateEdgesBoundingRect()
        }
      }

      if (type == 'pointerup') this.#stopTranslation()
    }
  }

  #setCssProps() {
    this.#cssProps.innerHTML = `
      :host {
        --origin-x: ${this.#origin.x};
        --origin-y: ${this.#origin.y};
        --unit: ${this.#unit}px;
        --cursor: ${this.#translation.isActive ? 'grab' : 'default'};
      }`
  }

  #startTranslation(start ) {
    this.#translation.start = start
    this.#translation.origin = this.#origin
    this.#translation.isActive = true
  }

  #stopTranslation() {
    this.#translation.isActive = false
    // Snap to unit grid.
    this.#origin = {
      x: Math.round(this.#origin.x),
      y: Math.round(this.#origin.y)
    }
    this.#setCssProps()
    this.#updateEdgesBoundingRect()
  }

  #updateEdgesBoundingRect() {
    for (const edge of this.#edgeSet.values()) edge.updateBoundingRect()
  }

  #updateEdgesBoundingRectAndPath() {
    for (const edge of this.#edgeSet.values()) {
      edge.updateBoundingRect()
      edge.updatePath()
    }
  }

  /** Get current origin in canvas coordinates. */
  get origin() {
    return this.#origin
  }

  /** Get current unit. */
  get unit() {
    return this.#unit
  }

  /** Register the given edge. */
  registerEdge(edge) {
    // TODO register and unregister edge could be done via mutation observer
    this.#edgeSet.add(edge)
  }

  /** Unregister the given edge. */
  unregisterEdge(edge) {
    this.#edgeSet.delete(edge)
  }

  /** Register the given pin. */
  registerPin(pin) {
    this.#pinMap.set(pin.uid, pin)
  }

  /** Unregister the given pin. */
  unregisterPin(pin) {
    this.#pinMap.delete(pin.uid)
  }

  /** Get pin by its uid, if any. */
  getPinElementByUid(uid){
    if (this.#pinMap.has(uid)) return this.#pinMap.get(uid)
  }
}

/** A pin is the start or the end of an edge. */
class VPin extends HTMLElement {
  /** Unique identifier */
  #uid = ''

  #node

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template['v-pin'].content.cloneNode(true))
  }

  static get observedAttributes() {
    return observedAttributes['v-pin']
  }

  attributeChangedCallback( name, _oldValue, newValue) {
    // Once the uid is registered on connect, it is a readonly value.
    if (name == 'uid') {
      const uid = this.#uid
      if (uid && newValue != uid) this.setAttribute('uid', uid)
    }
  }

  connectedCallback() {
    const canvas = this.node.canvas
    // Use given uid or create a new one to register the pin.
    const uidValue = this.getAttribute('uid') ?? canvas.uidRegister.createUid()
    const normalizedUid = normalizeUid(uidValue)
    const success = canvas.uidRegister.registerUid(normalizedUid)
    if (success) {
      this.#uid = normalizedUid
      canvas.registerPin(this)
      if (normalizedUid != uidValue) this.setAttribute('uid', normalizedUid)
    } else {
      const newUid = canvas.uidRegister.createUid()
      this.#uid = newUid
      canvas.registerPin(this)
      this.setAttribute('uid', newUid)
    }
  }

  disconnectedCallback() {
    this.node.canvas.unregisterPin(this)
    this.node.canvas.uidRegister.unregisterUid(this.#uid)
  }

  /** The pin size. */
  get size() {
    return this.node.canvas.unit
  }

  /** The top left coordinates. */
  get position() {
    const nodeStyle = getComputedStyle(this.node)
    const paddingLeft = parseFloat(nodeStyle.paddingLeft)
    const paddingTop = parseFloat(nodeStyle.paddingTop)
    return {
      x: this.node.offsetLeft + this.offsetLeft + paddingLeft,
      y: this.node.offsetTop + this.offsetTop + paddingTop
    }
  }

  /** The coordinates of the pin center in pixels. */
  get center() {
    const { position, size } = this
    return {
      x: position.x + size / 2,
      y: position.y + size / 2
    }
  }

  /** Get the node where the pin is contained. */
  get node() {
    if (this.#node) return this.#node
    try {
      return (this.#node = findParentElement('v-node', this))
    } catch (error) {
      this.remove()
      throw error
    }
  }

  /**
   * A pin has an identifier that is unique in the canvas that contains it.
   *
   * @remarks
   * The uid value is synced with the corresponding DOM attribute.
   */
  get uid() {
    return this.#uid
  }
}

/**
 * A node can contain pins. It must be inside a canvas.
 *
 * @example
 *
 * ```html
 * <v-canvas>
 *   <v-node>
 *     <v-row></v-row>
 *     <v-label text="Node"></v-label>
 *     <v-row>
 *       <v-pin></v-pin>
 *     </v-row>
 *   </v-node>
 * </v-canvas>
 * ```
 */
class VNode extends HTMLElement {
  #canvas
  #cssProps = document.createElement('style')
  #position = { x: 0, y: 0 }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const root = template['v-node'].content.cloneNode(true)
    this.#setCssProps()
    root.insertBefore(this.#cssProps, root.firstChild)
    this.shadowRoot.appendChild(root)
  }

  static get observedAttributes() {
    return observedAttributes['v-node']
  }

  attributeChangedCallback( name, _oldValue, newValue,) {
    // Handle a position change.
    if (name == 'xy') {
      if (newValue === null) {
        this.position = { x: 0, y: 0 }
        return
      }
      const [x, y] = newValue.split(',').map((value) => parseInt(value))
      if (isNaN(x) || isNaN(y)) {
        this.setAttribute(name, '0,0')
        return
      }
      this.position = { x, y }
    }
  }

  connectedCallback() {
    eventTypes['v-node'].forEach((eventType) => {
      this.addEventListener(eventType, this)
    })
  }

  handleEvent( event) {
    if (event.type == 'pointerdown') {
      // Move the node on top.
      // Notice that appendChild will not clone the node, it will move it at the end of the list.
      // Also, here the parentElement could be the v-canvas: in any case there is at least a v-canvas containing the node.
      this.parentElement.appendChild(this)
    }
  }

  #setCssProps() {
    this.#cssProps.innerHTML = `
      :host {
        --x: ${this.position.x};
        --y: ${this.position.y};
      }`
  }

  /** Get the canvas where the node is rendered. */
  get canvas() {
    if (this.#canvas) return this.#canvas
    try {
      return (this.#canvas = findParentElement('v-canvas', this))
    } catch (error) {
      this.remove()
      throw error
    }
  }

  /** Get current position. */
  get position() {
    return this.#position
  }

  /** Set position and update related CSS props. */
  set position({ x, y }) {
    if (x == this.#position.x && y == this.#position.y) return
    this.#position = { x, y }
    this.#setCssProps()
  }
}

/** An edge connects a list of two or more pins. */
class VEdge extends HTMLElement {
  #cssProps = document.createElement('style')

  #canvas

  #boundingRect = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  }

  /**
   * A list of uids to connect.
   *
   * @remarks
   * It is synced with path DOM attribute.
   */
  #pinUids

  #svg = {
    container: createElementSvg('svg'),
    path: createElementSvg('path')
      .set('fill', 'transparent')
      .set('stroke', 'currentColor'),
    width: 0,
    height: 0
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const root = template['v-edge'].content.cloneNode(true)
    this.#setCssProps()
    root.insertBefore(this.#cssProps, root.firstChild)
    this.#svg.container.appendChild(this.#svg.path)
    root.appendChild(this.#svg.container)
    this.shadowRoot.appendChild(root)
  }

  static get observedAttributes() {
    return observedAttributes['v-edge']
  }

  attributeChangedCallback( name, _oldValue, newValue) {
    if (name === 'path') {
      if (!newValue) return
      // Get only the pin uids that reference a pin.
      const uids = newValue.split(',').map(normalizeUid)
      // Check that path is normalize or reset it.
      const normalizePath = uids.join()
      if (normalizePath != newValue) {
        this.setAttribute('path', normalizePath)
        return
      }
      // An edge connects at least two pins.
      if (uids.length < 2) {
        this.removeAttribute('path')
        return
      }
      // Finally, store pin uids.
      this.#pinUids = uids
    }
  }

  connectedCallback() {
    this.canvas.registerEdge(this)
    this.updateBoundingRect()
    this.updatePath()
  }

  disconnectedCallback() {
    this.canvas.unregisterEdge(this)
  }

  #setCssProps() {
    this.#cssProps.innerHTML = `
      :host {
        --left: ${this.#boundingRect.left}px;
        --top: ${this.#boundingRect.top}px;
        --width: ${this.#boundingRect.width}px;
        --height: ${this.#boundingRect.height}px;
      }`
  }

  #updateSvgDimension(width , height) {
    if (width == this.#svg.width && height == this.#svg.height) return
    this.#svg.width = width
    this.#svg.height = height
    this.#svg.container
      .set('width', `${width}`)
      .set('height', `${height}`)
      .set('viewBox', `0 0 ${width} ${height}`)
  }

  updatePath() {
    const { canvas } = this
    let pathDraw = ''
    const { top, left } = this.#boundingRect
    for (const uid of this.#pinUids) {
      const pin = canvas.getPinElementByUid(uid)
      if (!pin) continue
      const {
        center: { x, y }
      } = pin
      pathDraw += `${pathDraw == '' ? 'M' : 'L'} ${x - left} ${y - top}`
    }
    this.#svg.path.set('d', pathDraw)
  }

  /** Get the canvas where the edge is rendered. */
  get canvas() {
    if (this.#canvas) return this.#canvas
    try {
      return (this.#canvas = findParentElement('v-canvas', this))
    } catch (error) {
      this.remove()
      throw error
    }
  }

  /** Compute bounds given by edge pins. */
  updateBoundingRect() {
    let x1 = Infinity,
      y1 = Infinity,
      x2 = -Infinity,
      y2 = -Infinity
    const { canvas } = this
    for (const uid of this.#pinUids) {
      const pin = canvas.getPinElementByUid(uid)
      if (!pin) continue
      const {
        position: { x, y },
        size
      } = pin
      x1 = Math.min(x1, x)
      y1 = Math.min(y1, y)
      x2 = Math.max(x2, x + size)
      y2 = Math.max(y2, y + size)
    }
    const width = x2 - x1
    const height = y2 - y1
    this.#boundingRect = {
      top: y1,
      left: x1,
      width,
      height
    }
    this.#setCssProps()
    this.#updateSvgDimension(width, height)
  }
}

/**
 * Display inline text.
 *
 * @example
 *
 * ```html
 * <v-label text="Label"></v-label>
 * ```
 */
class VLabel extends HTMLElement {
  textNode = document.createTextNode('')
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const root = template['v-label'].content.cloneNode(true)
    root.appendChild(this.textNode)
    this.shadowRoot.appendChild(root)
  }

  static get observedAttributes() {
    return observedAttributes['v-label']
  }

  attributeChangedCallback( name, _oldValue, newValue) {
    if (name == 'text') {
      this.textNode.textContent = newValue
    }
  }
}

export function defineFlowViewCustomElements() {
  for (const [elementName, ElementClass] of [
    // Order matters, an element could depend on another element to be defined.
  ['v-canvas', VCanvas],
  ['v-node', VNode],
  ['v-pin', VPin],
  ['v-edge', VEdge],
  ['v-label', VLabel],
  ['v-row', VRow],
  ['v-col', VCol]
  ])
    if (!window.customElements.get(elementName))
      window.customElements.define(elementName, ElementClass)
}
