const bindme = require('bindme')
const staticProps = require('static-props')

const SvgComponent = require('./SvgComponent')

/**
 * An input or output pin for a Node.
 */

class FlowViewPin extends SvgComponent {
  constructor (canvas, dispatch, container, nodeId, position) {
    super(canvas, dispatch, container)

    // Event bindings.
    // =================================================================

    bindme(this,
      'onMouseleave'
    )

    container.addEventListener('mouseleave', this.onMouseleave)

    // Do not select node when clicking on Pin.
    container.addEventListener('click', this.dropEvent)

    // Static attributes.
    // =================================================================

    staticProps(this)({
      nodeId,
      position,
      theme: () => canvas.theme.pin,
      x: () => parseInt(container.getAttribute('x'))
    })
  }

  onMouseleave () { this.dispatch('blurPin') }

  render (state) {
    const {
      container,
      theme
    } = this

    const { size } = theme

    const {
      graph,
      inspected,
      node,
      position,
      selected
    } = state

    const { name } = graph

    const nameChanged = name !== this.name
    const inspectedChanged = inspected !== this.inspected
    const selectedChanged = selected !== this.selected
    const sizeChanged = size !== this.size

    // Pin name.
    // =================================================================

    if (nameChanged) {
      this.name = name
    }

    // Pin x coordinate.
    // =================================================================

    if (node.widthChanged || node.numPinsChanged) {
      if (position === 0) {
        container.setAttribute('x', 0)
      } else {
        const x = position * (node.width - size) / (node.numPins - 1)
        container.setAttribute('x', x)
      }
    }

    // Pin size.
    // =================================================================

    if (sizeChanged) {
      this.size = size

      container.setAttribute('height', size)
      container.setAttribute('width', size)
    }

    // Pin color.
    // =================================================================

    if (inspectedChanged) {
      this.inspected = inspected
    }

    if (selectedChanged) {
      this.selected = selected
    }

    if (inspectedChanged || selectedChanged) {
      if (inspected) {
        container.setAttribute('fill', theme.inspectedColor)
      } else {
        if (selected) {
          container.setAttribute('fill', theme.highlightColor)
        } else {
          container.setAttribute('fill', theme.baseColor)
        }
      }
    }
  }
}

module.exports = FlowViewPin
