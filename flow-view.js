/**
 * Flow View Component base class.
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

export class FlowViewBox extends FlowViewComponent {
  constructor ({
    container,
    dimensions,
    position = { x: 0, y: 0 }
  }) {
    super({ container })

    Object.defineProperties(this, {
      dimensions: {
        get: () => ({
          width: container.getAttribute('width'),
          height: container.getAttribute('height')
        }),
        set: ({ width, height }) => {
          container.setAttribute('width', width)
          container.setAttribute('height', height)
        }
      },
      position: {
        get: () => ({
          x: container.getAttribute('y'),
          y: container.getAttribute('x')
        }),
        set: ({ x, y }) => {
          container.setAttribute('x', x)
          container.setAttribute('y', y)
        }
      }
    })

    this.dimensions = dimensions
    this.position = position
  }
}

export class FlowViewPin extends FlowViewComponent {}

export class FlowViewInput extends FlowViewComponent {
  constructor ({ container, id, index }) {
    super({ container, id, index })

    let linkId = null

    Object.defineProperties(this, {
      connect: { value: (id) => { linkId = id } },
      disconnect: { value: () => { linkId = null } },
      linkId: { get: () => linkId },
      isConnected: { get: () => linkId !== null }
    })
  }
}

export class FlowViewOutput extends FlowViewComponent {
  constructor ({ container, id, index }) {
    super({ container, id, index })

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
  constructor ({ container, dimensions }) {
    super({ container })

    const rect = new FlowViewBox({
      container: this.createSvgElement('rect'),
      dimensions
    })
  }
}

export class FlowViewCreator extends FlowViewComponent {}

export class FlowViewLink extends FlowViewComponent {}

export class FlowViewInspector extends FlowViewComponent {}

export class FlowViewNodeText extends FlowViewComponent {
  render ({ text }) {
    this.container.innerHTML = text
  }
}

export class FlowViewNodeContent extends FlowViewBox {
  constructor ({
    canvas,
    container,
    dimensions,
    NodeContentRootClass = FlowViewNodeText,
    position
  }) {
    super({ container, dimensions, position })

    Object.defineProperties(this, {
      canvas: { value: canvas },
      root: { value: new NodeContentRootClass({ container: this.createElement('div') }) }
    })
  }
}

export class FlowViewNode extends FlowViewComponent {
  constructor ({
    canvas,
    container,
    nodeJson,
    NodeContentClass = FlowViewNodeContent
  }) {
    super({ container })

    const { gridUnit } = canvas

    const inputBarContainer = this.createSvgElement('g')
    const contentContainer = this.createSvgElement('foreignObject')
    const outputBarContainer = this.createElement('g')

    // Define `canvas` first, since it is used by other code below.
    Object.defineProperty(this, 'canvas', { value: canvas })

    const { width, height } = this.computeDimensions(nodeJson)

    const content = new NodeContentClass({
      canvas,
      container: contentContainer,
      dimensions: { width, height },
      position: { x: 0, y: gridUnit }
    })

    Object.defineProperties(this, {
      content: { value: content },
      inputBar: { value: new FlowViewPinBar({
        container: inputBarContainer,
        dimensions: { width, height: gridUnit }
      })},
      outputBar: { value: new FlowViewPinBar({
        container: outputBarContainer,
        dimensions: { width, height: gridUnit }
      })}
    })

    content.root.render(nodeJson)
  }

  computeDimensions (nodeJson) {
    const { width, height } = this.canvas.textRuler.sizeOfText(
      // Add an extra character for padding.
      nodeJson.text + 'x'
    )

    return {
      width: Math.ceil(width),
      height: Math.ceil(height)
    }
  }

  createInput () {}

  createOutput () {}
}

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

export class FlowViewCanvas extends FlowViewComponent {
  constructor (container, {
    gridUnit = 10,
    LinkClass = FlowViewLink,
    NodeClass = FlowViewNode
  } = {}) {
    super({ container })

    Object.defineProperties(this, {
      fontSize: { get: () => parseInt(this.style.fontSize) },
      gridUnit: { value: gridUnit },
      links: { value: new Map() },
      nodes: { value: new Map() },
      LinkClass: { value: LinkClass },
      NodeClass: { value: NodeClass },
      svgLayer: {
        value: new FlowViewBox({
          container: this.createSvgElement('svg'),
          // Fit SVG layer initially.
          dimensions: this.boundingClientRect
        })
      },
      textRuler: {
        value: new FlowViewTextRuler({ container: this.createElement('div') })
      }
    })
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
}
