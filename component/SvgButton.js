const staticProps = require('static-props')

const SvgComponent = require('./SvgComponent')

class SvgButton extends SvgComponent {
  constructor (canvas, dispatch, container) {
    super(canvas, dispatch, container)

    // DOM Elements.
    // =================================================================

    const svg = this.createElementNS('svg')

    const path = this.createElementNS('path', svg)
    path.shapeRendering = 'optimizeQuality'

    // Static attributes.
    // =================================================================

    staticProps(this)({
      path,
      svg
    })
  }

  render (state) {
    const {
      path,
      svg
    } = this

    const {
      theme
    } = state

    const {
      color,
      size
    } = theme

    // Changed properties.
    // =================================================================

    const colorChanged = this.color !== color
    const sizeChanged = this.size !== size

    // Color.
    // =================================================================

    if (colorChanged) {
      this.color = color

      path.setAttribute('fill', color)
    }

    // Size.
    // =================================================================

    if (sizeChanged) {
      this.size = size

      svg.setAttribute('viewBox', `0 0 ${size} ${size}`)
      svg.style.height = size
      svg.style.width = size

      this.setShape(size)
    }
  }

  setShape () {
    console.error('setShape method is abstract')
  }
}

module.exports = exports.default = SvgButton
