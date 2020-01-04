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

  /**
   * Generate a random id.
   */
  generateId () {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 4)
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
  constructor ({ container, id, position = { x: 0, y: 0 } }) {
    super({ container, id })

    let x, y

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
    id,
    position = { x: 0, y: 0 }
  }) {
    super({ container, id })

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
  constructor ({ container, dimension, id, index, node, position }) {
    super({ container, dimension, id, position })

    Object.defineProperties(this, {
      index: { value: index },
      node: { value: node }
    })

    container.addEventListener('mouseenter', () => this.highlight(true))

    container.addEventListener('mouseleave', () => this.highlight(false))
  }
}

export class FlowViewInput extends FlowViewPin {
  constructor ({ container, dimension, inputJson, index, node, position }) {
    super({ container, dimension, id: inputJson.id, index, node, position })

    const { canvas } = node

    let link = null

    Object.defineProperties(this, {
      connect: {
        value: (newValue) => {
          link = newValue
          link.to = this.id
          link.targetPoint = node.inputCenter(this.index)
        }
      },
      disconnect: {
        value: () => {
          link.to = null
          link = null
        }
      },
      link: { get: () => link },
      isConnected: { get: () => link !== null }
    })

    container.addEventListener('mousedown', event => {
      event.stopPropagation()

      if (this.isConnected) {
        canvas.halfConnectedLink = this.link
        canvas.dragStart(event)
      }
    })

    container.addEventListener('mouseenter', event => {
      event.stopPropagation()

      const { halfConnectedLink } = canvas

      if (halfConnectedLink && halfConnectedLink.from) {
        this.connect(halfConnectedLink)
      }
    })

    container.addEventListener('mouseleave', event => {
      event.stopPropagation()

      const { halfConnectedLink } = canvas

      if (halfConnectedLink) {
        this.disconnect()
      }
    })
  }
}

export class FlowViewOutput extends FlowViewPin {
  constructor ({ container, dimension, outputJson, index, node, position }) {
    super({ container, dimension, id: outputJson.id, index, node, position })

    const links = new Set()

    Object.defineProperties(this, {
      connect: {
        value: (newValue) => {
          newValue.from = this.id
          newValue.sourcePoint = node.outputCenter(this.index)
          links.add(newValue)
        }
      },
      disconnect: {
        value: (oldValue) => {
          oldValue.from = null
          links.remove(oldValue)
        }
      },
      links: { get: () => links },
      isConnected: { get: () => links.size > 0 }
    })

    container.addEventListener('mousedown', event => {
      event.stopPropagation()
    })
  }
}

export class FlowViewPinBar extends FlowViewGroup {
  constructor ({ container, dimension, id, position }) {
    super({ container, id, position })

    Object.defineProperties(this, {
      rect: {
        value: new FlowViewBox({
          container: this.createSvgElement('rect'),
          dimension
        })
      }
    })
  }
}

export class FlowViewLink extends FlowViewComponent {
  constructor ({
    container,
    linkJson,
    sourcePoint = { x: 0, y: 0 },
    targetPoint = { x: 0, y: 0 }
  }) {
    super({
      container,
      id: linkJson.id
    })

    let x1 = sourcePoint.x1
    let y1 = sourcePoint.y1
    let x2 = sourcePoint.x2
    let y2 = sourcePoint.y2

    let from = linkJson.from
    let to = linkJson.to

    Object.defineProperties(this, {
      from: {
        get: () => from,
        set: (newValue) => { from = newValue }
      },
      line: { value: this.createSvgElement('line') },
      sourcePoint: {
        get: () => sourcePoint,
        set: ({ x, y }) => {
          x1 = x
          y1 = y

          this.line.setAttribute('x1', x1)
          this.line.setAttribute('y1', y1)
        }
      },
      targetPoint: {
        get: () => targetPoint,
        set: ({ x, y }) => {
          x2 = x
          y2 = y

          this.line.setAttribute('x2', x2)
          this.line.setAttribute('y2', y2)
        }
      },
      to: {
        get: () => to,
        set: (newValue) => { to = newValue }
      }
    })

    this.sourcePoint = sourcePoint
    this.targetPoint = targetPoint
  }
}

export class FlowViewNodeText extends FlowViewBox {
  constructor ({ container, dimension, position, text }) {
    super({ container, dimension, position })

    const div = new FlowViewComponent({ container: this.createElement('div') })

    div.container.innerHTML = text
  }
}

export class FlowViewNodeInspector extends FlowViewComponent {
  constructor ({ container, node }) {
    super({ container })

    container.innerHTML = node.text
  }
}

export class FlowViewNode extends FlowViewGroup {
  constructor ({
    canvas,
    container,
    nodeJson,
    NodeInspectorClass = FlowViewNodeInspector
  }) {
    super({
      container,
      id: nodeJson.id,
      position: canvas.roundPosition(nodeJson)
    })

    const inputBarContainer = this.createSvgElement('g')
    const contentContainer = this.createSvgElement('foreignObject')
    const outputBarContainer = this.createSvgElement('g')

    let inspector = null
    let text = nodeJson.text

    Object.defineProperties(this, {
      attachInspector: {
        value: (canvasInspector) => {
          const nodeInspector = new NodeInspectorClass({
            container: canvasInspector.createElement('div'),
            node: this
          })

          inspector = nodeInspector
        }
      },
      canvas: { value: canvas },
      content: {
        value: this.spawnContent({
          canvas,
          container: contentContainer,
          nodeJson
        })
      },
      detachInspector: {
        value: () => {
          inspector.dispose()
          inspector = null
        }
      },
      NodeInspectorClass: { value: NodeInspectorClass },
      inputs: { value: new Map() },
      inspector: {
        get: () => inspector
      },
      outputBarPosition: {
        get: () => {
          const { height } = this.content.dimension

          return {
            x: 0,
            y: canvas.gridUnit + height
          }
        }
      },
      outputs: { value: new Map() },
      pinBarDimension: {
        get: () => {
          const { width } = this.content.dimension

          return {
            width,
            height: canvas.gridUnit
          }
        }
      },
      text: {
        get: () => text,
        set: (newValue) => { text = newValue }
      }
    })

    const pinX = ({ index, width, height, num }) => {
      return index === 0 ? 0 : index * (width - height) / (num - 1)
    }

    Object.defineProperties(this, {
      inputBar: {
        value: new FlowViewPinBar({
          container: inputBarContainer,
          dimension: this.pinBarDimension
        })
      },
      inputPosition: {
        value: (index) => {
          const { width, height } = this.pinBarDimension

          return {
            x: pinX({ index, width, height, num: this.inputs.size }),
            y: 0
          }
        }
      },
      outputBar: {
        value: new FlowViewPinBar({
          container: outputBarContainer,
          dimension: this.pinBarDimension,
          position: this.outputBarPosition
        })
      },
      outputPosition: {
        value: (index) => {
          const { width, height } = this.pinBarDimension

          return {
            x: pinX({ index, width, height, num: this.outputs.size }),
            y: 0
          }
        }
      }
    })

    Object.defineProperties(this, {
      inputCenter: {
        value: (index) => {
          const {
            inputPosition,
            pinBarDimension,
            position
          } = this

          const half = pinBarDimension.height / 2
          const pinPosition = inputPosition(index)

          return {
            x: position.x + pinPosition.x + half,
            y: position.y + pinPosition.y + half
          }
        }
      },
      outputCenter: {
        value: (index) => {
          const {
            outputBarPosition,
            outputPosition,
            pinBarDimension,
            position
          } = this

          const half = pinBarDimension.height / 2
          const pinPosition = outputPosition(index)

          return {
            x: position.x + pinPosition.x + half,
            y: position.y + pinPosition.y + outputBarPosition.y + half
          }
        }
      }
    })

    Object.defineProperty(this, 'json', {
      get: () => {
        const {
          id,
          position: { x, y },
          text
        } = this

        return {
          id,
          outs: [],
          ins: [],
          text,
          x,
          y
        }
      }
    })

    container.addEventListener('click', event => {
      event.stopPropagation()

      canvas.dragEnd()
    })

    container.addEventListener('dblclick', event => {
      event.stopPropagation()

      console.log('dblclick')
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

  createInput (inputJson = {}) {
    const { gridUnit, inputs } = this.canvas
    const index = this.inputs.size

    const input = new FlowViewInput({
      container: this.inputBar.createSvgElement('rect'),
      dimension: { width: gridUnit, height: gridUnit },
      index,
      inputJson: {
        id: this.generateId(),
        ...inputJson
      },
      node: this,
      position: this.inputPosition(index)
    })

    this.inputs.set(input.id, input)
    inputs.set(input.id, input)

    return input
  }

  createOutput (outputJson = {}) {
    const { gridUnit, outputs } = this.canvas
    const index = this.outputs.size

    const output = new FlowViewOutput({
      container: this.outputBar.createSvgElement('rect'),
      dimension: { width: gridUnit, height: gridUnit },
      index,
      node: this,
      outputJson: {
        id: this.generateId(),
        ...outputJson
      },
      position: this.outputPosition(index)
    })

    this.outputs.set(output.id, output)
    outputs.set(output.id, output)

    return output
  }

  spawnContent ({ canvas, container, nodeJson }) {
    const { text } = nodeJson

    const dimension = canvas.roundDimension(canvas.textRuler.sizeOfText(
      // Add an extra character for padding.
      text + 'x'
    ))

    const content = new FlowViewNodeText({
      container,
      dimension,
      position: { x: 0, y: canvas.gridUnit },
      text
    })

    return content
  }
}

export class FlowViewCreator extends FlowViewNode {
  spawnContent ({ canvas, container, nodeJson }) {
    const dimension = canvas.roundDimension(canvas.textRuler.sizeOfText('xxxxxxxxxxxxxxxxx'))

    const content = new FlowViewBox({
      container,
      dimension,
      position: { x: 0, y: canvas.gridUnit }
    })

    const input = new FlowViewComponent({
      container: content.createElement('input')
    })

    input.container.type = 'text'
    input.container.focus()

    input.container.addEventListener('keypress', ({ key, target }) => {
      switch (key) {
        case 'Enter': {
          const text = target.value.trim()

          if (text !== '') {
            canvas.createNode({ text, x: nodeJson.x, y: nodeJson.y })
          }

          break
        }
      }
    })

    return content
  }
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

export class FlowViewInspector extends FlowViewComponent {
  constructor ({ container }) {
    super({ container })

    let inspectedItem = null

    Object.defineProperties(this, {
      hasInspectedItem: {
        get: () => inspectedItem !== null
      },
      inspectedItem: {
        get: () => inspectedItem,
        set: (newValue) => { inspectedItem = newValue }
      }
    })
  }

  attach (item) {
    // Remove presious inspected item.
    if (this.hasInspectedItem && this.inspectedItem.id !== item.id) {
      this.inspectedItem.detachInspector()
      this.inspectedItem = null
    }

    switch (true) {
      case item instanceof FlowViewCreator:
        break

      case item instanceof FlowViewNode:
        this.inspectedItem = item

        item.attachInspector(this)

        break
    }
  }
}

export class FlowViewSvgLayer extends FlowViewBox {
  constructor ({
    container,
    dimension = { width: 0, height: 0 },
    position = { x: 0, y: 0 },
    scale
  }) {
    super({ container, dimension, position })

    let scaleFactor = 1 / scale

    Object.defineProperties(this, {
      scale: {
        get: () => scaleFactor,
        set: (newValue) => {
          scaleFactor = 1 / newValue

          const { x, y } = this.position
          const { width, height } = this.dimension

          container.setAttribute('viewBox', `${x} ${y} ${width * scaleFactor} ${height * scaleFactor}`)
        }
      }
    })

    Object.defineProperties(this, {
      viewBox: {
        get: () => Object.assign({}, this.position, this.dimension),
        set: ({
          x = this.position.x,
          y = this.position.y,
          width = this.dimension.width,
          height = this.dimension.height,
          scale = this.scale
        }) => {
          this.position = { x, y }
          this.dimension = { width, height }

          container.setAttribute('viewBox', `${x} ${y} ${width * scale} ${height * scale}`)
        }
      }
    })

    this.viewBox = { ...position, ...dimension }
  }

  translate (vector) {
    const { x, y } = this.viewBox

    this.viewBox = { x: x - vector.x, y: y - vector.y }
  }
}

export class FlowViewCanvas extends FlowViewComponent {
  constructor (container, {
    gridUnit = 10,
    CreatorClass = FlowViewCreator,
    LinkClass = FlowViewLink,
    InspectorClass = FlowViewInspector,
    NodeClass = FlowViewNode
  } = {}) {
    super({ container })

    const inspectorContainer = this.createElement('div')
    const svgLayerContainer = this.createSvgElement('svg')

    let creator = null
    let currentX, currentY
    let halfConnectedLink = null
    let isDragging = false
    let dragStartedTimeoutId
    let dragStartedMoving = false
    let scale = 1

    const inspector = new InspectorClass({
      container: inspectorContainer
    })

    const moveLinksConnectedTo = (node) => {
      node.inputs.forEach(input => {
        if (input.isConnected) {
          input.link.targetPoint = node.inputCenter(input.index)
        }
      })

      node.outputs.forEach(output => {
        if (output.isConnected) {
          output.links.forEach(link => {
            link.sourcePoint = node.outputCenter(output.index)
          })
        }
      })
    }

    Object.defineProperties(this, {
      closeCreator: {
        value: () => {
          if (this.hasCreator) {
            creator.dispose()
            creator = null
          }
        }
      },
      creator: {
        get: () => creator,
        set: (newValue) => {
          this.closeCreator()
          creator = newValue
        }
      },
      CreatorClass: { value: CreatorClass },
      dragEnd: {
        value: () => {
          const { halfConnectedLink, selectedNodes } = this

          clearTimeout(dragStartedTimeoutId)

          isDragging = false

          if (halfConnectedLink) {
            // Clean up link if not connected to source or target.
            if (halfConnectedLink.from === null || halfConnectedLink.to === null) {
              halfConnectedLink.dispose()
            }

            this.halfConnectedLink = null
          } else if (selectedNodes.size > 0) {
            // Snap to grid.
            selectedNodes.forEach(node => {
              node.position = this.roundPosition(node.position)

              moveLinksConnectedTo(node)
            })
          }
        }
      },
      dragMove: {
        value: ({ clientX, clientY }) => {
          const { halfConnectedLink, selectedNodes, svgLayer } = this

          if (isDragging) {
            // Smooth drag start: if drag started moving now, update current pointer position.
            // This happens after `dragTimeout` milliseconds.
            if (dragStartedMoving === false) {
              dragStartedMoving = true

              currentX = clientX
              currentY = clientY
            }

            if (halfConnectedLink) {
              const { width: inspectorWidth } = this.inspector.boundingClientRect
              const { left: canvasLeft, top: canvasTop } = this.boundingClientRect

              const x = currentX - inspectorWidth - canvasLeft
              const y = currentY - canvasTop
              if (halfConnectedLink.from === null) {
                halfConnectedLink.sourcePoint = { x, y }
              } else if (halfConnectedLink.to === null) {
                halfConnectedLink.targetPoint = { x, y }
              }
            } else if (selectedNodes.size > 0) {
              // Move selected nodes.
              selectedNodes.forEach(node => {
                node.translate({ x: clientX - currentX, y: clientY - currentY })

                moveLinksConnectedTo(node)
              })
            } else {
              // Move canvas.
              svgLayer.translate({ x: clientX - currentX, y: clientY - currentY })
            }

            currentX = clientX
            currentY = clientY
          }
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
      halfConnectedLink: {
        get: () => halfConnectedLink,
        set: (newValue) => { halfConnectedLink = newValue }
      },
      hasCreator: { get: () => creator !== null },
      inputs: { value: new Map() },
      isDragging: { get: () => isDragging },
      LinkClass: { value: LinkClass },
      links: { value: new Map() },
      inspector: { value: inspector },
      nodes: { value: new Map() },
      outputs: { value: new Map() },
      NodeClass: { value: NodeClass },
      selectedNodes: { value: new Set() },
      svgLayerDimension: {
        get: () => {
          const { width, height } = this.boundingClientRect

          return {
            width: width - inspector.boundingClientRect.width,
            height
          }
        }
      },
      textRuler: {
        value: new FlowViewTextRuler({ container: this.createElement('div') })
      }
    })

    Object.defineProperties(this, {
      svgLayer: {
        value: new FlowViewSvgLayer({
          container: svgLayerContainer,
          dimension: this.svgLayerDimension,
          scale
        })
      }
    })

    Object.defineProperties(this, {
      scale: {
        get: () => scale,
        set: (newValue) => {
          scale = newValue
          this.svgLayer.scale = newValue
        }
      }
    })

    container.addEventListener('dblclick', event => {
      event.stopPropagation()

      const { x, y } = this.svgLayer.boundingClientRect
      const { clientX, clientY } = event

      this.spawnCreator({ x: clientX - x, y: clientY - y - gridUnit })
    })

    container.addEventListener('click', event => {
      event.stopPropagation()

      this.clearSelection()
      this.dragEnd()
      this.closeCreator()
    })

    container.addEventListener('mousedown', event => {
      event.stopPropagation()

      this.clearSelection()
      this.dragStart(event)
    })

    container.addEventListener('mouseleave', () => {
      if (isDragging) {
        this.dragEnd()
      }
    })

    container.addEventListener('mousemove', this.dragMove.bind(this))

    container.addEventListener('wheel', event => {
      event.preventDefault()

      let scale = this.scale

      const minScale = 0.1
      const maxScale = 1

      scale += event.deltaY * +0.001
      scale = Math.min(Math.max(minScale, scale), maxScale)
      this.scale = scale
    })
  }

  clearSelection () {
    const { selectedNodes } = this

    selectedNodes.forEach(node => node.highlight(false))
    selectedNodes.clear()
  }

  connect (item) {
    switch (true) {
      case item instanceof FlowViewLink:
        return {
          to: (pin) => {
            switch (true) {
              case pin instanceof FlowViewInput:
                pin.connect(item)
                break
              case pin instanceof FlowViewOutput:
                pin.connect(item)
                break
            }
          }
        }
      case item instanceof FlowViewInput:
        return {
          to: (link) => {
            item.connect(link)
          }
        }
      case item instanceof FlowViewOutput:
        return {
          to: (link) => {
            item.connect(link)
          }
        }

      default: console.error('Cannot connect item', item)
    }
  }

  createLink (linkJson = {}, { LinkClass = this.LinkClass } = {}) {
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
    this.closeCreator()

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

  inspect (node) {
    this.inspector.attach(node)
  }

  roundDimension ({ width = 0, height = 0 }) {
    const [a, b] = this.roundVector([width, height])

    return { width: a, height: b }
  }

  roundPosition ({ x = 0, y = 0 }) {
    const [a, b] = this.roundVector([x, y])

    return { x: a, y: b }
  }

  roundVector ([a, b]) {
    const { gridUnit } = this

    const aInt = Math.round(a)
    const bInt = Math.round(b)

    const aIntRest = aInt % gridUnit
    const bIntRest = bInt % gridUnit

    return [
      aIntRest <= Math.round(gridUnit / 2) ? aInt - aIntRest : aInt + gridUnit - aIntRest,
      bIntRest <= Math.round(gridUnit / 2) ? bInt - bIntRest : bInt + gridUnit - bIntRest
    ]
  }

  selectNode ({ multiSelection, node }) {
    const { selectedNodes } = this

    if (selectedNodes.has(node)) return

    if (!multiSelection) {
      this.clearSelection()
      this.inspect(node)
    }

    node.highlight(true)
    selectedNodes.add(node)
  }

  spawnCreator (position, CreatorClass = this.CreatorClass) {
    this.creator = new CreatorClass({
      canvas: this,
      container: this.svgLayer.createSvgElement('g'),
      nodeJson: position
    })
  }
}
