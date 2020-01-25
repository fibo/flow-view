/**
 * @typedef {FlowViewSerializedPin}
 * @param {String} id
 */

/**
 * @typedef {FlowViewSerializedNode}
 * @param {Number} x
 * @param {Number} y
 * @param {Number=} width
 * @param {Number=} height
 * @param {String} id
 * @param {String} text
 * @param {FlowViewSerializedPin[]} ins
 * @param {FlowViewSerializedPin[]} outs
 */

/**
 * @typedef {FlowViewSerializedPin}
 * @param {String} id
 */

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
  constructor ({
    container,
    // Convention: every JavaScript class has the same name as its DOM container.
    cssClassName = this.constructor.name,
    id
  }) {
    container.classList.add(cssClassName)

    Object.defineProperties(this, {
      boundingClientRect: { get: () => container.getBoundingClientRect() },
      container: { value: container },
      isHighlighted: { get: () => container.classList.contains(`${cssClassName}--highlighted`) },
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
    const { container, cssClassName } = this

    if (enable) {
      container.classList.add(`${cssClassName}--highlighted`)
    } else {
      container.classList.remove(`${cssClassName}--highlighted`)
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
        this.disconnect()
        canvas.dragStart(event)
      } else {
        const center = this.node.inputCenter(this.index)

        link = canvas.createLink({ to: this.id }, { sourcePoint: center })

        canvas.halfConnectedLink = link
        canvas.dragStart(event)
      }
    })

    container.addEventListener('mouseup', event => {
      event.stopPropagation()

      const { halfConnectedLink } = canvas

      if (halfConnectedLink && !halfConnectedLink.hasTarget) {
        this.connect(halfConnectedLink)
      }
    })
  }

  dispose () {
    if (this.isConnected) {
      this.link.dispose()
    }

    super.dispose()
  }
}

export class FlowViewOutput extends FlowViewPin {
  constructor ({ container, dimension, outputJson, index, node, position }) {
    super({ container, dimension, id: outputJson.id, index, node, position })

    const { canvas } = node

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

      const center = this.node.outputCenter(this.index)

      const link = canvas.createLink({ from: this.id }, { targetPoint: center })
      this.links.add(link)

      canvas.halfConnectedLink = link
      canvas.dragStart(event)
    })

    container.addEventListener('mouseup', event => {
      event.stopPropagation()

      const { halfConnectedLink } = canvas

      if (halfConnectedLink && !halfConnectedLink.hasSource) {
        this.connect(halfConnectedLink)
      }
    })
  }

  dispose () {
    if (this.isConnected) {
      this.links.forEach(link => link.dispose())
    }

    super.dispose()
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
    canvas,
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
      canvas: { value: canvas },
      from: {
        get: () => from,
        set: (newValue) => { from = newValue }
      },
      line: { value: this.createSvgElement('line') },
      hasSource: { get: () => typeof from === 'string' },
      hasTarget: { get: () => typeof to === 'string' },
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

    container.addEventListener('click', event => event.stopPropagation())

    container.addEventListener('mousedown', event => {
      event.stopPropagation()

      canvas.selectLink({
        multiSelection: event.shiftKey,
        link: this
      })
    })

    container.addEventListener('mouseup', event => event.stopPropagation())
  }

  dispose () {
    this.canvas.links.delete(this.id)

    super.dispose()
  }
}

export class FlowViewNodeContent extends FlowViewBox {
  /**
   * Abstract method called when content is updated.
   *
   * @param {FlowViewSerializedNode} json
   */
  updateContent () {}
}

export class FlowViewNodeText extends FlowViewNodeContent {
  constructor ({ container, dimension, position, text }) {
    super({ container, dimension, position })

    Object.defineProperties(this, {
      div: {
        value: new FlowViewComponent({ container: this.createElement('div') })
      }
    })

    this.div.container.innerHTML = text
  }

  updateContent (node) {
    this.div.container.innerHTML = node.text
  }
}

export class FlowViewEditNumPin extends FlowViewComponent {
  constructor ({ container, setValue, value: defaultValue }) {
    super({ container })

    const min = 0

    container.type = 'number'
    container.min = min
    container.value = defaultValue

    const submit = (value) => {
      if (value.trim() === '') {
        container.value = defaultValue
        return
      }

      // Only integers allowed.
      const int = Math.round(value)

      if (value < min) {
        container.value = defaultValue
      } else {
        defaultValue = int
        setValue(int)
      }
    }

    container.addEventListener('blur', event => {
      submit(event.target.value)
    })

    container.addEventListener('keypress', ({ key, target }) => {
      switch (key) {
        case 'Enter':
          container.blur()
          break
      }
    })
  }
}

export class FlowViewNodeTextEditor extends FlowViewComponent {
  constructor ({ container, submit, value: defaultValue }) {
    super({ container })

    container.type = 'text'
    container.value = defaultValue

    container.addEventListener('blur', event => {
      const text = event.target.value.trim()

      if (text !== '') submit(text)
    })

    container.addEventListener('keypress', ({ key, target }) => {
      switch (key) {
        case 'Enter':
          container.blur()
          break
      }
    })
  }
}

export class FlowViewNodeInspector extends FlowViewComponent {
  constructor ({ container, node }) {
    super({ container })

    const textField = new FlowViewComponent({ container: this.createElement('div') })

    const textLabel = textField.createElement('label')
    textLabel.style.display = 'block'
    textLabel.innerHTML = 'Text'
    textLabel.for = 'text'

    const textInput = new FlowViewNodeTextEditor({
      container: textField.createElement('input'),
      submit: (text) => {
        node.text = text
      },
      value: node.text
    })

    const inputsField = new FlowViewComponent({ container: this.createElement('div') })

    const inputsLabel = inputsField.createElement('label')
    inputsLabel.innerHTML = 'Inputs'

    const inputsEditor = new FlowViewComponent({
      container: inputsField.createElement('div')
    })

    const inputsNumEditor = new FlowViewEditNumPin({
      container: inputsEditor.createElement('input'),
      setValue: (value) => {
        const numInputs = node.inputs.size

        for (let i = value; i < numInputs; i++) {
          node.deleteInput()
        }

        for (let i = numInputs; i < value; i++) {
          node.createInput()
        }
      },
      value: node.inputs.size
    })

    const outputsField = new FlowViewComponent({ container: this.createElement('div') })

    const outputsLabel = outputsField.createElement('label')
    outputsLabel.innerHTML = 'Outputs'

    const outputsEditor = new FlowViewComponent({
      container: outputsField.createElement('div')
    })

    const outputsNumEditor = new FlowViewEditNumPin({
      container: outputsEditor.createElement('input'),
      setValue: (value) => {
        const numOutputs = node.outputs.size

        for (let i = value; i < numOutputs; i++) {
          node.deleteOutput()
        }

        for (let i = numOutputs; i < value; i++) {
          node.createOutput()
        }
      },
      value: node.outputs.size
    })

    const deleteNodeButton = this.createElement('button')
    deleteNodeButton.innerHTML = 'Delete'
    deleteNodeButton.addEventListener('click', event => {
      event.preventDefault()

      node.dispose()
      this.dispose()
    })

    Object.defineProperties(this, {
      inputsNumEditor: { value: inputsNumEditor },
      outputsNumEditor: { value: outputsNumEditor },
      textInput: { value: textInput }
    })
  }
}

export class FlowViewNode extends FlowViewGroup {
  constructor ({
    canvas,
    container,
    nodeJson,
    NodeContentClass = FlowViewNodeText,
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
      NodeContentClass: { value: NodeContentClass },
      NodeInspectorClass: { value: NodeInspectorClass }
    })

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
        value: (index, num = this.inputs.size) => {
          const { width, height } = this.pinBarDimension

          const x = pinX({ index, width, height, num })

          return { x, y: 0 }
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
        value: (index, num = this.outputs.size) => {
          const { width, height } = this.pinBarDimension

          const x = pinX({ index, width, height, num })

          return { x, y: 0 }
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

    Object.defineProperties(this, {
      text: {
        get: () => text,
        set: (newValue) => {
          text = newValue

          this.content.updateContent(this.json)
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
    const {
      canvas: { gridUnit },
      generateId,
      inputBar,
      inputPosition,
      inputs
    } = this

    const numInputs = inputs.size

    inputs.forEach(input => {
      input.position = inputPosition(input.index, numInputs + 1)
    })

    const index = numInputs
    const position = inputPosition(index, numInputs + 1)

    const input = new FlowViewInput({
      container: inputBar.createSvgElement('rect'),
      dimension: { width: gridUnit, height: gridUnit },
      index,
      inputJson: {
        id: generateId(),
        ...inputJson
      },
      node: this,
      position
    })

    inputs.set(input.id, input)

    return input
  }

  createOutput (outputJson = {}) {
    const {
      canvas: { gridUnit },
      generateId,
      outputBar,
      outputs,
      outputPosition
    } = this

    const numOutputs = outputs.size

    outputs.forEach(output => {
      output.position = outputPosition(output.index, numOutputs + 1)
    })

    const index = numOutputs
    const position = outputPosition(index, numOutputs + 1)

    const output = new FlowViewOutput({
      container: outputBar.createSvgElement('rect'),
      dimension: { width: gridUnit, height: gridUnit },
      index,
      node: this,
      outputJson: {
        id: generateId(),
        ...outputJson
      },
      position
    })

    outputs.set(output.id, output)

    return output
  }

  deleteInput () {
    const { inputs } = this

    const index = inputs.size - 1

    inputs.forEach(input => {
      if (input.index === index) {
        inputs.delete(input.id)
        input.dispose()
      }
    })
  }

  deleteOutput () {
    const { outputs } = this

    const index = outputs.size - 1

    outputs.forEach(output => {
      if (output.index === index) {
        outputs.delete(output.id)
        output.dispose()
      }
    })
  }

  dispose () {
    this.inputs.forEach(input => {
      if (input.isConnected) {
        input.link.dispose()
      }
    })

    this.outputs.forEach(output => {
      if (output.isConnected) {
        output.links.forEach(link => link.dispose())
      }
    })

    this.canvas.nodes.delete(this.id)

    super.dispose()
  }

  spawnContent ({ canvas, container, nodeJson }) {
    const {
      NodeContentClass
    } = this

    const { text, width = 0, height = 0 } = nodeJson

    const textDimension = canvas.roundDimension(canvas.textRuler.sizeOfText(
      // Add an extra character for padding.
      text + 'x'
    ))

    const content = new NodeContentClass({
      container,
      dimension: {
        width: Math.max(width, textDimension.width),
        height: Math.max(height, textDimension.height)
      },
      nodeJson,
      position: { x: 0, y: canvas.gridUnit }
    })

    content.updateContent(nodeJson)

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

    const input = new FlowViewNodeTextEditor({
      container: content.createElement('input'),
      submit: (text) => {
        canvas.createNode({ text, x: nodeJson.x, y: nodeJson.y })
      },
      value: ''
    })

    input.container.focus()

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

    container.addEventListener('click', event => event.stopPropagation())

    container.addEventListener('mousedown', event => event.stopPropagation())
  }

  attach (item) {
    // Remove presious inspected item.
    if (this.hasInspectedItem && this.inspectedItem.id !== item.id) {
      this.detach()
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

  detach () {
    if (this.hasInspectedItem) {
      this.inspectedItem.detachInspector()
      this.inspectedItem = null
    }
  }
}

export class FlowViewSvgLayer extends FlowViewBox {
  constructor ({
    container,
    dimension = { width: 0, height: 0 },
    position = { x: 0, y: 0 }
  }) {
    super({ container, dimension, position })

    let scale = 1

    Object.defineProperties(this, {
      linksLayer: { value: new FlowViewComponent({ container: this.createSvgElement('g') }) },
      nodesLayer: { value: new FlowViewComponent({ container: this.createSvgElement('g') }) },
      viewBox: {
        get: () => Object.assign({}, this.position, this.dimension),
        set: ({
          x = this.position.x,
          y = this.position.y,
          width = this.dimension.width,
          height = this.dimension.height,
          scaleFactor = 1 / scale
        }) => {
          this.position = { x, y }
          this.dimension = { width, height }

          container.setAttribute('viewBox', `${x} ${y} ${Math.floor(scaleFactor * width)} ${Math.floor(scaleFactor * height)}`)
        }
      }
    })

    this.viewBox = { ...position, ...dimension }

    container.addEventListener('wheel', event => {
      event.preventDefault()

      const minScale = 0.1
      const maxScale = 1

      scale += event.deltaY * +0.001
      scale = Math.min(Math.max(minScale, scale), maxScale)

      this.viewBox = { scaleFactor: 1 / scale }
    })
  }

  translate (vector) {
    const { x, y } = this.viewBox

    this.viewBox = { x: x - vector.x, y: y - vector.y }
  }
}

export class FlowViewCanvas extends FlowViewComponent {
  constructor (container, {
    cssClassName = 'FlowViewCanvas',
    gridUnit = 10,
    CreatorClass = FlowViewCreator,
    LinkClass = FlowViewLink,
    InspectorClass = FlowViewInspector,
    NodeClass = FlowViewNode
  } = {}) {
    super({ container, cssClassName })

    const inspectorContainer = this.createElement('div')
    const svgLayerContainer = this.createSvgElement('svg')

    let creator = null
    let currentX, currentY
    let halfConnectedLink = null
    let isDragging = false
    let dragStartedTimeoutId
    let dragStartedMoving = false

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
            // Clean up link if not connected both to source and target.
            if (halfConnectedLink.hasTarget === false || halfConnectedLink.hasSource === false) {
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
            if (dragStartedMoving === false) {
              dragStartedMoving = true

              currentX = clientX
              currentY = clientY
            }

            if (halfConnectedLink) {
              const { width: inspectorWidth } = this.inspector.boundingClientRect
              const { left: canvasLeft, top: canvasTop } = this.boundingClientRect
              const origin = this.svgLayer.position

              const x = currentX - inspectorWidth - canvasLeft + origin.x
              const y = currentY - canvasTop + origin.y

              if (halfConnectedLink.hasTarget) {
                halfConnectedLink.sourcePoint = { x, y }
              }

              if (halfConnectedLink.hasSource) {
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
          }, 100)
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
      selectedLinks: { value: new Set() },
      selectedNodes: { value: new Set() },
      svgLayerDimension: {
        get: () => {
          const { width, height } = this.boundingClientRect

          return {
            width: Math.floor(width - inspector.boundingClientRect.width),
            height: Math.floor(height)
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
          dimension: this.svgLayerDimension
        })
      }
    })

    Object.defineProperties(this, {
      resizeHandler: {
        value: () => {
          const { width, height } = this.svgLayerDimension

          this.svgLayer.viewBox = { width, height }
        }
      }
    })

    window.addEventListener('resize', this.resizeHandler)

    container.addEventListener('dblclick', event => {
      event.stopPropagation()

      const origin = this.svgLayer.position
      const { x, y } = this.svgLayer.boundingClientRect
      const { clientX, clientY } = event

      this.spawnCreator({ x: clientX - x + origin.x, y: clientY - y + origin.y - gridUnit })
    })

    container.addEventListener('click', event => {
      event.stopPropagation()

      this.clearSelection()
      this.dragEnd()
      this.closeCreator()
      this.inspector.detach()
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
  }

  clearSelection () {
    const { selectedNodes, selectedLinks } = this

    selectedLinks.forEach(link => link.highlight(false))
    selectedLinks.clear()

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

  createLink (linkJson = {}, { LinkClass = this.LinkClass, sourcePoint, targetPoint } = {}) {
    const { from, to } = linkJson

    let input
    let output

    this.nodes.forEach(node => {
      if (from) {
        if (node.outputs.has(from)) {
          output = node.outputs.get(from)
        }
      }

      if (to) {
        if (node.inputs.has(to)) {
          input = node.inputs.get(to)
        }
      }
    })

    const link = new LinkClass({
      canvas: this,
      container: this.svgLayer.linksLayer.createSvgElement('g'),
      linkJson: {
        id: this.generateId(),
        ...linkJson
      },
      sourcePoint,
      targetPoint
    })

    if (output) output.connect(link)
    if (input) input.connect(link)

    this.links.set(link.id, link)

    return link
  }

  createNode (nodeJson, { NodeClass = this.NodeClass } = {}) {
    this.closeCreator()

    const node = new NodeClass({
      canvas: this,
      container: this.svgLayer.nodesLayer.createSvgElement('g'),
      nodeJson: {
        id: this.generateId(),
        ...nodeJson
      }
    })

    // Create pins.
    Object.assign([], nodeJson.ins).forEach(pin => node.createInput(pin))
    Object.assign([], nodeJson.outs).forEach(pin => node.createOutput(pin))

    this.nodes.set(node.id, node)

    return node
  }

  dispose () {
    document.removeEventListener('resize', this.resizeHandler)
  }

  inspect (item) {
    this.inspector.attach(item)
  }

  loadGraph ({ links, nodes }) {
    // Create nodes first.
    nodes.forEach(node => this.createNode(node))

    // Then create links.
    links.forEach(link => this.createLink(link))
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

  selectLink ({ multiSelection, link }) {
    const { selectedLinks } = this

    if (selectedLinks.has(link)) return

    if (!multiSelection) {
      this.clearSelection()
    }

    link.highlight(true)
    selectedLinks.add(link)
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

    // Add to selection all links that interconnects current selected nodes.

    // 1. Get all output ids and links connected to some input.
    const outputIds = []
    const links = []

    selectedNodes.forEach(node => {
      node.inputs.forEach(input => {
        if (input.isConnected) {
          links.push(input.link)
        }
      })

      node.outputs.forEach(output => {
        outputIds.push(output.id)
      })
    })

    // 2. If a link connected to some input and its from is among the outputIds,
    //    then it is part of the selected items.
    links.forEach(link => {
      if (outputIds.includes(link.from)) {
        this.selectLink({ link, multiSelection })
      }
    })
  }

  spawnCreator (position, CreatorClass = this.CreatorClass) {
    this.creator = new CreatorClass({
      canvas: this,
      container: this.svgLayer.createSvgElement('g'),
      nodeJson: position
    })
  }
}
