const bindme = require('bindme')
const pdsp = require('pdsp')
const staticProps = require('static-props')

const Component = require('./Component')

/**
 * A Link connects a node output to another node input.
 */

class FlowViewLink extends Component {
  constructor (canvas, dispatch, container) {
    super(canvas, dispatch, container)

    // DOM Elements.
    // =================================================================

    const line = this.createElementNS('path')
    const start = this.createElementNS('circle')
    const end = this.createElementNS('circle')

    // Static attributes.
    // =================================================================

    staticProps(this)({
      end,
      line,
      id: () => container.getAttribute('id'),
      start,
      theme: () => canvas.theme.link
    })

    // Event bindings.
    // =================================================================

    bindme(this,
      'onClick',
      'onDblclick'
    )

    container.addEventListener('click', this.onClick)
    container.addEventListener('dblclick', this.onDblclick)
    container.addEventListener('mousedown', this.dropEvent)
  }

  onClick (event) {
    pdsp(event)

    const { id, dispatch } = this

    dispatch('selectLink', id)
  }

  onDblclick (event) {
    pdsp(event)

    const { id, dispatch } = this

    dispatch('deleteLink', id)
  }

  render (state) {
    const {
      canvas,
      line,
      start,
      end
    } = this

    const {
      // TODO graph,
      endX,
      endY,
      selected,
      startX,
      startY
    } = state

    const pinSize = canvas.theme.pin.size

    const {
      baseColor,
      highlightColor,
      width
    } = this.theme

    // TODO const {from, to} = graph
    // TODO const connected = (typeof from !== 'undefined') && (typeof to !== 'undefined')

    // Changed properties.
    // =================================================================

    const endXChanged = (endX !== this.endX)
    const endYChanged = (endY !== this.endY)
    const pinSizeChanged = (pinSize !== this.pinSize)
    const selectedChanged = (selected !== this.selected)
    const startXChanged = (startX !== this.startX)
    const startYChanged = (startY !== this.startY)
    const widthChanged = (width !== this.width)

    // Link width.
    // =================================================================

    if (widthChanged) {
      this.width = width

      line.setAttribute('stroke-width', width)
    }

    // Link color.
    // =================================================================

    if (selectedChanged) {
      this.selected = selected

      if (selected) {
        line.setAttribute('stroke', highlightColor)
        start.setAttribute('fill', highlightColor)
        end.setAttribute('fill', highlightColor)
      } else {
        line.setAttribute('stroke', baseColor)
        start.setAttribute('fill', baseColor)
        end.setAttribute('fill', baseColor)
      }
    }

    // Start and end position.
    // =================================================================

    if (startXChanged) {
      this.startX = startX
      start.setAttribute('cx', startX)
    }

    if (startYChanged) {
      this.startY = startY
      start.setAttribute('cy', startY)
    }

    if (endXChanged) {
      this.endX = endX
      end.setAttribute('cx', endX)
    }

    if (endYChanged) {
      this.endY = endY
      end.setAttribute('cy', endY)
    }

    if (startXChanged || startYChanged || endXChanged || endYChanged) {
      // TODO Code for bezier
      // const midPointY = (startY + endY) / 2
      //
      // const controlPointX1 = startX
      // const controlPointY1 = midPointY
      // const controlPointX2 = endX
      // const controlPointY2 = midPointY
      //
      // `M ${startX} ${startY} C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2} ,${endX} ${endY}`

      line.setAttribute('d', `M ${startX} ${startY} L ${endX} ${endY}`)
    }

    // Start and end size.
    // =================================================================

    if (pinSizeChanged) {
      this.pinSize = pinSize
      start.setAttribute('r', pinSize / 2)
      end.setAttribute('r', pinSize / 2)
    }
  }
}

module.exports = exports.default = FlowViewLink
