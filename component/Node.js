const bindme = require('bindme')
const pdsp = require('pdsp')
const staticProps = require('static-props')

const Component = require('./Component')
const In = require('./In')
const Out = require('./Out')

/**
 * A Node is a rectangular component with inputs and outputs.
 */

class FlowViewNode extends Component {
  constructor (frame, dispatch, container) {
    super(dispatch, container)

    this.inRef = {}
    this.outRef = {}

    // DOM Elements.
    // =================================================================

    const rect = this.createElementNS('rect')
    rect.setAttribute('stroke-width', 1)

    const topbar = this.createElementNS('rect')

    const bottombar = this.createElementNS('rect')

    const label = this.createElementNS('text')
    label.setAttribute('text-anchor', 'middle')

    const toggle = this.createElementNS('circle')
    toggle.style.display = 'none'

    // Event bindings.
    // =================================================================

    bindme(this,
      'onClickToggle',
      'onMousedown',
      'onMouseup'
    )

    container.addEventListener('mousedown', this.onMousedown)
    container.addEventListener('mouseup', this.onMouseup)

    toggle.addEventListener('mousedown', this.onClickToggle)

    // Static attributes.
    // =================================================================

    staticProps(this)({
      bottombar,
      container,
      frame,
      label,
      id: () => container.getAttribute('id'),
      numIns: () => Object.keys(this.inRef).length,
      numOuts: () => Object.keys(this.outRef).length,
      rect,
      toggle,
      topbar
    })
  }

  createInspectorContainer () {
    const inspectorContainer = this.createElementNS('foreignObject')

    this.inspectorContainer = inspectorContainer
  }

  deleteInspectorContainer () {
    console.log(this.inspectorContainer)
  }

  generateInId (position) { return `${this.id}-i${position}` }

  generateOutId (position) { return `${this.id}-o${position}` }

  getInRefByPosition (position) {
    const pinId = this.generateInId(position)

    return this.inRef[pinId]
  }

  getOutRefByPosition (position) {
    const pinId = this.generateOutId(position)

    return this.outRef[pinId]
  }

  onClickToggle (event) {
    this.showInspector()
  }

  onMousedown (event) {
    const { dispatch, id } = this

    dispatch('selectNode', id)
  }

  onMouseup (event) {
    pdsp(event)

    const {
      dispatch,
      frame
    } = this

    if (frame.draggingItems) {
      return dispatch('stopDraggingItems')
    }

    if (frame.draggingLink) {
      return dispatch('deleteHalfLink')
    }
  }

  render (state) {
    const {
      bottombar,
      container,
      dispatch,
      frame,
      id,
      label,
      rect,
      toggle,
      topbar
    } = this

    const {
      connectedIns,
      connectedOuts,
      currentPin,
      draggedLink,
      draggedLinkType,
      draggingLink,
      graph,
      selected,
      textSize,
      theme
    } = state

    const { fontSize } = theme.frame
    const {
      backgroundColor,
      baseColor,
      highlightColor
    } = theme.node
    const pinSize = theme.pin.size

    const {
      ins,
      outs,
      text,
      x,
      y
    } = Object.assign({}, defaultGraph, graph)

    const { height, width } = computeDims(textSize, pinSize, graph.height, graph.width)

    // Changed properties.
    // =================================================================

    const backgroundColorChanged = (backgroundColor !== this.backgroundColor)
    const fontSizeChanged = (fontSize !== this.fontSize)
    const pinSizeChanged = (pinSize !== this.pinSize)
    const heightChanged = (height !== this.height)
    const textChanged = (text !== this.text)
    const numInsChanged = (ins.length !== this.numIns)
    const numOutsChanged = (outs.length !== this.numOuts)
    const selectedChanged = (selected !== this.selected)
    const widthChanged = (width !== this.width)
    const xChanged = (x !== this.x)
    const yChanged = (y !== this.y)

    // Node position.
    // =================================================================

    if (xChanged || yChanged) {
      this.x = x
      this.y = y
      container.setAttributeNS(null, 'transform', `translate(${x},${y})`)
    }

    // Node dimensions.
    // =================================================================

    if (pinSizeChanged) {
      this.pinSize = pinSize

      bottombar.setAttribute('height', pinSize)
      topbar.setAttribute('height', pinSize)
    }

    if (heightChanged) {
      this.height = height

      rect.setAttribute('height', height)
    }

    if (heightChanged || pinSizeChanged) {
      bottombar.setAttribute('transform', `translate(0,${height - pinSize})`)

      toggle.setAttribute('r', (height - pinSize) / 2)
      toggle.setAttribute('cx', -height / 2)
      toggle.setAttribute('cy', height / 2)
    }

    if (heightChanged || fontSizeChanged) {
      label.setAttribute('y', Math.round(height / 2) + fontSize / 3)
    }

    if (widthChanged) {
      this.width = width

      bottombar.setAttribute('width', width)
      label.setAttribute('x', Math.round(width / 2))
      rect.setAttribute('width', width)
      topbar.setAttribute('width', width)
    }

    // Node text.
    // =================================================================

    if (textChanged) {
      this.text = text
      label.textContent = text
    }

    // Node color.
    // =================================================================

    if (backgroundColorChanged) {
      this.backgroundColor = backgroundColor
      rect.setAttribute('fill', backgroundColor)
    }

    if (selectedChanged) {
      this.selected = selected

      if (selected) {
        bottombar.setAttribute('fill', highlightColor)
        rect.setAttribute('stroke', highlightColor)

        toggle.setAttribute('fill', highlightColor)
        toggle.style.display = ''

        topbar.setAttribute('fill', highlightColor)
      } else {
        bottombar.setAttribute('fill', baseColor)

        rect.setAttribute('stroke', baseColor)

        toggle.style.display = 'none'

        topbar.setAttribute('fill', baseColor)
      }
    }

    // Node ins.
    // =================================================================

    // Remove deleted ins.
    for (let position = ins.length; position < this.numIns; position++) {
      const pinId = this.generateInId(position)

      this.inRef[pinId].container.remove()
    }

    // Render ins or create new ones.
    ins.forEach((pin, position) => {
      const pinId = this.generateInId(position)

      const pinType = pin.type || null

      const pinState = {
        connected: (connectedIns.indexOf(position) > -1),
        graph: pin,
        highlighted: draggingLink ? (typeof draggedLink.from !== 'undefined') && (draggedLinkType === pinType) : false,
        inspected: currentPin && currentPin.type === 'in' && currentPin.position === position,
        node: {
          heightChanged,
          height,
          numPins: ins.length,
          numPinsChanged: numInsChanged,
          width,
          widthChanged
        },
        position,
        selected,
        theme: theme.pin
      }

      const pinRef = this.inRef[pinId]

      if (pinRef) {
        pinRef.render(pinState)
      } else {
        const element = this.createElementNS('rect')

        const pin = new In(frame, dispatch, element, id, position)
        pin.render(pinState)

        this.inRef[pinId] = pin
      }
    })

    // Node outs.
    // =================================================================

    // Remove deleted outs.
    for (let position = outs.length; position < this.numOuts; position++) {
      const pinId = this.generateOutId(position)

      this.outRef[pinId].container.remove()
    }

    // Render outs or create new ones.
    outs.forEach((pin, position) => {
      const pinId = this.generateOutId(position)

      const pinType = pin.type || null

      const pinState = {
        connected: (connectedOuts.indexOf(position) > -1),
        graph: pin,
        highlighted: draggingLink ? (typeof draggedLink.to !== 'undefined') && (draggedLinkType === pinType) : false,
        inspected: currentPin && currentPin.type === 'out' && currentPin.position === position,
        node: {
          heightChanged,
          height,
          numPins: outs.length,
          numPinsChanged: numOutsChanged,
          width,
          widthChanged
        },
        position,
        selected,
        theme: theme.pin
      }

      const pinRef = this.outRef[pinId]

      if (pinRef) {
        pinRef.render(pinState)
      } else {
        const element = this.createElementNS('rect')

        const pin = new Out(frame, dispatch, element, id, position)
        pin.render(pinState)

        this.outRef[pinId] = pin
      }
    })
  }

  showInspector () {
    this.createInspectorContainer()

    this.deleteInspectorContainer()
  }
}

// Static methods.
// ====================================================================

/**
 * Calculate width and height for a Node.
 */

function computeDims (textSize, pinSize, desiredHeight, desiredWidth) {
  const minHeight = textSize.height + 2 * pinSize
  const minWidth = textSize.width + pinSize

  const height = typeof desiredHeight === 'number' ? Math.max(desiredHeight, minHeight) : minHeight
  const width = typeof desiredWidth === 'number' ? Math.max(desiredWidth, minWidth) : minWidth

  return { height, width }
}

// Static attributes.
// ====================================================================

const defaultGraph = {
  text: 'Node',
  ins: [],
  outs: []
}

staticProps(FlowViewNode)({
  computeDims,
  defaultGraph
})

module.exports = exports.default = FlowViewNode
