const bindme = require('bindme')
const pdsp = require('pdsp')
const staticProps = require('static-props')

const SvgComponent = require('./SvgComponent')
const In = require('./In')
const Out = require('./Out')

/**
 * A Node is a rectangular component with inputs and outputs.
 */

class FlowViewNode extends SvgComponent {
  constructor (canvas, frame, dispatch, container) {
    super(canvas, dispatch, container)

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

    // Event bindings.
    // =================================================================

    bindme(this,
      'onMousedown',
      'onMouseup'
    )

    container.addEventListener('click', this.dropEvent)
    container.addEventListener('dblclick', this.dropEvent)
    container.addEventListener('mousedown', this.onMousedown)
    container.addEventListener('mouseup', this.onMouseup)

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
      theme: () => canvas.theme.node,
      topbar
    })
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
      canvas,
      container,
      dispatch,
      frame,
      id,
      label,
      rect,
      topbar
    } = this

    const {
      backgroundColor,
      baseColor,
      highlightColor
    } = this.theme

    const pinSize = canvas.theme.pin.size
    const fontSize = canvas.theme.frame.fontSize

    const {
      connectedIns,
      connectedOuts,
      currentPin,
      draggedLink,
      draggedLinkType,
      draggingLink,
      graph,
      selected,
      textSize
    } = state

    const {
      ins,
      outs,
      name,
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
    const nameChanged = (name !== this.text)
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

    // Node name.
    // =================================================================

    if (nameChanged) {
      this.name = name
      label.textContent = name
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
        topbar.setAttribute('fill', highlightColor)
      } else {
        bottombar.setAttribute('fill', baseColor)
        rect.setAttribute('stroke', baseColor)
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
        selected
      }

      const pinRef = this.inRef[pinId]

      if (pinRef) {
        pinRef.render(pinState)
      } else {
        const element = this.createElementNS('rect')

        const pin = new In(canvas, frame, dispatch, element, id, position)
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
        selected
      }

      const pinRef = this.outRef[pinId]

      if (pinRef) {
        pinRef.render(pinState)
      } else {
        const element = this.createElementNS('rect')

        const pin = new Out(canvas, frame, dispatch, element, id, position)
        pin.render(pinState)

        this.outRef[pinId] = pin
      }
    })
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
//= ====================================================================

const defaultGraph = {
  name: 'Node',
  ins: [],
  outs: []
}

staticProps(FlowViewNode)({
  computeDims,
  defaultGraph
})

module.exports = FlowViewNode
