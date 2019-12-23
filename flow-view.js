const dragTimeout = 150

/**
 * Flow View Component base class.
 *
 * @typedef {FlowViewComponentArgs}
 * @prop {HTMLElement|SVGElement} container
 * @prop {String=} id
 *
 * @example
 *
 * export class MyComponent extends FlowViewComponent {
 *   constructor ({ container, otherParams }) {
 *     super(container)
 *
 *     // Create children elements, order matters.
 *     const subComponentContainer1 = this.createElement('div')
 *     const subComponentContainer2 this.createElement('div')
 *
 *     ...
 *   }
 * }
 *
 * @param {FlowViewComponentArgs} args
 */
export class FlowViewComponent {
  constructor ({ container, id }) {
    // Convention: every JavaScript class has the same name as its DOM container.
    const className = this.constructor.name
    container.classList.add(className)

    Object.defineProperties(this, {
      boundingClientRect: { get: () => container.getBoundingClientRect() },
      container: { value: container },
      isHighlighted: { get: () => container.classList.contains(`${className}--highlighted`) },
      style: { value: window.getComputedStyle(container) }
    })

    if (typeof id === 'string') {
      container.id = id

      Object.defineProperty(this, 'id', { value: id })
    }
  }

  appendChild (element) {
    return this.container.appendChild(element)
  }

  createElement (qualifiedName) {
    return this.appendChild(document.createElement(qualifiedName))
  }

  createSvgElement (qualifiedName) {
    return this.appendChild(document.createElementNS('http://www.w3.org/2000/svg', qualifiedName))
  }
  /**
   * Cleanup component.
   *
   * Override this method to add actions to be done on component disposing.
   *
   * Notice that it is not necessary event listener it they are attached to its container.
   *
   * In case of overriding you must call also `super.dispose()`.
   */
  dispose () {
    this.container.remove()
  }

  generateId () {
    return Math.random().toString(36).substring(8, 15)
  }
  /**
   * Toggle highlight CSS class modifier.
   *
   * @param {Boolean} enable
   */
  highlight (enable) {
    const { container } = this
    const className = this.constructor.name

    if (enable) {
      container.classList.add(`${className}--highlighted`)
    } else {
      container.classList.remove(`${className}--highlighted`)
    }
  }
}

export class FlowViewGroup extends FlowViewComponent {
  constructor ({ container, id, position }) {
    super({ container, id })

    let { x, y } = position

    Object.defineProperties(this, {
      position: {
        get: () => ({ x, y }),
        set: ({ x: xx, y: yy }) => {
          x = xx
          y = yy
          container.setAttribute('transform', `translate(${x},${y})`)
        }
      }
    })

    this.position = position
  }

  translate (vector) {
    const { x, y } = this.position

    this.position = { x: x + vector.x, y: y + vector.y }
  }
}

export class FlowViewBox extends FlowViewComponent {
  constructor ({
    container,
    dimension,
    position = { x: 0, y: 0 }
  }) {
    super({ container })

    Object.defineProperties(this, {
      dimension: {
        get: () => ({
          width: Number(container.getAttribute('width')),
          height: Number(container.getAttribute('height'))
        }),
        set: ({ width, height }) => {
          container.setAttribute('width', width)
          container.setAttribute('height', height)
        }
      },
      position: {
        get: () => ({
          x: Number(container.getAttribute('x')),
          y: Number(container.getAttribute('y'))
        }),
        set: ({ x, y }) => {
          container.setAttribute('x', x)
          container.setAttribute('y', y)
        }
      }
    })

    this.dimension = dimension
    this.position = position
  }
}

export class FlowViewPin extends FlowViewBox {
  constructor ({ container, dimension, position }) {
    super({ container, dimension, position })

    container.addEventListener('mouseenter', () => this.highlight(true))

    container.addEventListener('mouseleave', () => this.highlight(false))
  }
}

export class FlowViewInput extends FlowViewPin {
  constructor (args) {
    super(args)

    let linkId = null

    Object.defineProperties(this, {
      connect: { value: (id) => { linkId = id } },
      disconnect: { value: () => { linkId = null } },
      linkId: { get: () => linkId },
      isConnected: { get: () => linkId !== null }
    })
  }
}

export class FlowViewOutput extends FlowViewPin {
  constructor (args) {
    super(args)

    const linkIds = new Set()

    Object.defineProperties(this, {
      connect: { value: (linkId) => { linkIds.add(linkId) } },
      disconnect: { value: (linkId) => { linkIds.remove(linkId) } },
      linkIds: { get: () => linkIds },
      isConnected: { get: () => this.linkIds.size > 0 }
    })
  }
}

export class FlowViewPinBar extends FlowViewComponent {
  constructor ({ container, dimension, position }) {
    super({ container })

    Object.defineProperties(this, {
      rect: {
        value: new FlowViewBox({
          container: this.createSvgElement('rect'),
          dimension,
          position
        })
      }
    })
  }
}

export class FlowViewCreator extends FlowViewComponent {}

export class FlowViewLink extends FlowViewComponent {
  constructor ({ container, linkJson }) {
    super({
      container,
      id: linkJson.id
    })
  }
}

export class FlowViewNodeText extends FlowViewComponent {
  render (nodeJson) {
    this.container.innerHTML = nodeJson.text
  }
}

Object.defineProperty(FlowViewNodeText, 'computedimension', {
  value: ({ canvas, nodeJson }) => {
    const dimension = canvas.textRuler.sizeOfText(
      // Add an extra character for padding.
      nodeJson.text + 'x'
    )

    return canvas.roundDimension(dimension)
  }
})

export class FlowViewNodeContent extends FlowViewBox {
  constructor ({
    container,
    dimension,
    NodeContentRootClass,
    position
  }) {
    super({ container, dimension, position })

    Object.defineProperties(this, {
      root: {
        value: new NodeContentRootClass({
          container: this.createElement('div')
        })
      }
    })
  }
}

export class FlowViewNode extends FlowViewGroup {
  constructor ({
    canvas,
    container,
    nodeJson,
    NodeContentRootClass = FlowViewNodeText
  }) {
    super({
      container,
      id: nodeJson.id,
      position: canvas.roundPosition(nodeJson)
    })

    const { gridUnit } = canvas

    const inputBarContainer = this.createSvgElement('g')
    const contentContainer = this.createSvgElement('foreignObject')
    const outputBarContainer = this.createSvgElement('g')

    const { width, height } = NodeContentRootClass.computedimension({ canvas, nodeJson })

    const content = new FlowViewNodeContent({
      canvas,
      container: contentContainer,
      dimension: { width, height },
      NodeContentRootClass,
      position: { x: 0, y: gridUnit }
    })

    const outputBarPosition = () => {
      return { x: 0, y: gridUnit + height }
    }

    const pinBarDimension = () => {
      return { width, height: gridUnit }
    }

    Object.defineProperties(this, {
      canvas: { value: canvas },
      content: { value: content },
      inputBar: {
        value: new FlowViewPinBar({
          container: inputBarContainer,
          dimension: pinBarDimension()
        })
      },
      inputs: { value: new Map() },
      outputBar: {
        value: new FlowViewPinBar({
          container: outputBarContainer,
          dimension: pinBarDimension(),
          position: outputBarPosition()
        })
      },
      outputBarPosition: {
        get: outputBarPosition
      },
      outputs: { value: new Map() }
    })

    content.root.render(nodeJson)

    container.addEventListener('click', event => {
      event.stopPropagation()

      canvas.dragEnd()
    })

    container.addEventListener('mousedown', event => {
      event.stopPropagation()

      canvas.selectNode({
        multiSelection: event.shiftKey,
        node: this
      })

      canvas.dragStart(event)
    })
  }

  createInput () {
    const { gridUnit } = this.canvas
    const index = this.inputs.size

    const input = new FlowViewInput({
      container: this.inputBar.createSvgElement('rect'),
      id: this.generateId(),
      dimension: { width: gridUnit, height: gridUnit }
    })

    this.inputs.set(index, input)

    return input
  }

  createOutput () {
    const { gridUnit } = this.canvas
    const index = this.outputs.size

    const output = new FlowViewOutput({
      container: this.outputBar.createSvgElement('rect'),
      id: this.generateId(),
      dimension: { width: gridUnit, height: gridUnit },
      position: this.outputBarPosition
    })

    this.outputs.set(index, output)

    return output
  }
}

export class FlowViewInspector extends FlowViewNode {}

/**
 * Text size calculator.
 */
class FlowViewTextRuler extends FlowViewComponent {
  sizeOfText (text) {
    const { container } = this

    container.textContent = text

    const { width, height } = this.boundingClientRect

    return { width, height }
  }
}

export class FlowViewSvgLayer extends FlowViewBox {
  constructor ({
    container,
    dimension = { width: 0, height: 0 },
    position = { x: 0, y: 0 }
  }) {
    super({ container, dimension, position })

    Object.defineProperties(this, {
      viewBox: {
        get: () => Object.assign({}, this.position, this.dimension),
        set: ({
          x = this.position.x,
          y = this.position.y,
          width = this.dimension.width,
          height = this.dimension.height
        }) => {
          this.position = { x, y }
          this.dimension = { width, height }

          container.setAttribute('viewBox', `${x} ${y} ${width} ${height}`)
        }
      }
    })

    container.setAttribute('viewBox', `${position.x} ${position.y} ${dimension.width} ${dimension.height}`)
  }

  translate (vector) {
    const { x, y } = this.viewBox

    this.viewBox = { x: x - vector.x, y: y - vector.y }
  }
}

export class FlowViewCanvas extends FlowViewComponent {
  constructor (container, {
    gridUnit = 10,
    LinkClass = FlowViewLink,
    NodeClass = FlowViewNode
  } = {}) {
    super({ container })

    let isDragging = false
    let dragStartedTimeoutId
    let dragStartedMoving = false
    let currentX, currentY

    Object.defineProperties(this, {
      dragEnd: {
        value: () => {
          clearTimeout(dragStartedTimeoutId)

          isDragging = false
        }
      },
      dragStart: {
        value: () => {
          clearTimeout(dragStartedTimeoutId)

          dragStartedMoving = false

          dragStartedTimeoutId = setTimeout(() => {
            dragStartedTimeoutId = null
            isDragging = true
          }, dragTimeout)
        }
      },
      fontSize: { get: () => parseInt(this.style.fontSize) },
      gridUnit: { value: gridUnit },
      isDragging: { get: () => isDragging },
      links: { value: new Map() },
      nodes: { value: new Map() },
      LinkClass: { value: LinkClass },
      NodeClass: { value: NodeClass },
      selectedNodes: { value: new Set() },
      svgLayer: {
        value: new FlowViewSvgLayer({
          container: this.createSvgElement('svg'),
          dimension: this.boundingClientRect
        })
      },
      textRuler: {
        value: new FlowViewTextRuler({ container: this.createElement('div') })
      }
    })

    const dragMove = ({ clientX, clientY }) => {
      const { selectedNodes, svgLayer } = this

      if (isDragging) {
        // Smooth drag start: if drag started moving now, update current pointer position.
        // This happens after `dragTimeout` milliseconds.
        if (dragStartedMoving === false) {
          dragStartedMoving = true

          currentX = clientX
          currentY = clientY
        }

        if (selectedNodes.size > 0) {
          // Move selected nodes.
          selectedNodes.forEach(node => {
            node.translate({ x: clientX - currentX, y: clientY - currentY })
          })
        } else {
          // Move canvas.
          svgLayer.translate({ x: clientX - currentX, y: clientY - currentY })
        }

        currentX = clientX
        currentY = clientY
      }
    }

    container.addEventListener('click', () => {
      this.clearSelection()

      this.dragEnd()
    })

    container.addEventListener('mousedown', event => {
      this.clearSelection()

      this.dragStart(event)
    })

    container.addEventListener('mouseleave', () => {
      if (isDragging) {
        this.dragEnd()
      }
    })

    container.addEventListener('mousemove', dragMove)
  }

  clearSelection () {
    const { selectedNodes } = this

    selectedNodes.forEach(node => node.highlight(false))
    selectedNodes.clear()
  }

  connect () {
    return {
      to: Function.prototype
    }
  }

  createLink (linkJson, { LinkClass = this.LinkClass } = {}) {
    const link = new LinkClass({
      container: this.svgLayer.createSvgElement('g'),
      linkJson: {
        id: this.generateId(),
        ...linkJson
      }
    })

    this.links.set(link.id, link)

    return link
  }

  createNode (nodeJson, { NodeClass = this.NodeClass } = {}) {
    const node = new NodeClass({
      canvas: this,
      container: this.svgLayer.createSvgElement('g'),
      nodeJson: {
        id: this.generateId(),
        ...nodeJson
      }
    })

    this.nodes.set(node.id, node)

    return node
  }

  roundDimension ({ width = 0, height = 0 }) {
    const [a, b] = this.roundVector([ width, height ])

    return { width: a, height: b }
  }

  roundPosition ({ x = 0, y = 0 }) {
    const [a, b] = this.roundVector([ x, y ])

    return { x: a, y: b }
  }

  roundVector ([a, b]) {
    const { gridUnit } = this

    const aInt = Math.floor(a)
    const bInt = Math.floor(b)

    return [
      (aInt % gridUnit) === 0 ? aInt : aInt + gridUnit - (aInt % gridUnit),
      (aInt % gridUnit) === 0 ? bInt : bInt + gridUnit - (bInt % gridUnit)
    ]
  }

  selectNode ({ multiSelection, node }) {
    const { selectedNodes } = this

    if (selectedNodes.has(node)) return

    if (!multiSelection) this.clearSelection()

    node.highlight(true)
    selectedNodes.add(node)
  }
}
