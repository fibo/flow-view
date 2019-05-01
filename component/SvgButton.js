const staticProps = require('static-props')

const Component = require('./Component')

class SvgButton extends Component {
  constructor (dispatch, container) {
    super(dispatch, container)

    // DOM Elements.
    // =================================================================

    const path = this.createElementNS('path')
    path.shapeRendering = 'optimizeQuality'

    // Static attributes.
    // =================================================================

    staticProps(this)({
      path
    })
  }

  render (state) {
    const {
      container,
      path
    } = this

    const {
      color,
      size
    } = state.theme

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

      container.setAttribute('viewBox', `0 0 ${size} ${size}`)
      container.style.height = size
      container.style.width = size

      this.setShape(size)
    }
  }

  setShape () {
    console.error('setShape method is abstract')
  }
}

module.exports = exports.default = SvgButton
