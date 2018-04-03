const bindme = require('bindme')
const staticProps = require('static-props')

const SvgComponent = require('./SvgComponent')

/**
 * The Creator appears on double click and can create nodes.
 */

class FlowViewCreator extends SvgComponent {
  constructor (canvas, dispatch, container) {
    super(canvas, dispatch, container)

    // DOM Elements.
    // =================================================================

    const input = this.createElement('input')
    input.setAttribute('type', 'text')
    input.style.outline = 'none'

    // Static props.
    // =================================================================

    staticProps(this)({
      input
    })

    // Event bindings.
    // =================================================================

    bindme(this,
      'onInputKeypress'
    )

    input.addEventListener('keypress', this.onInputKeypress)
  }

  onInputKeypress (event) {
    const {
      dispatch,
      input,
      x,
      y
    } = this

    const name = event.target.value

    switch (event.key) {
      case 'Enter':
        dispatch('createNode', {
          name,
          x,
          y
        })

        input.value = ''

        break

      default: break
    }
  }

  render (state) {
    const {
      canvas,
      container,
      input
    } = this

    const {
      hidden,
      x,
      y
    } = state.creator

    const { fontFamily, fontSize } = canvas.theme.frame

    // Changed properties.
    // =================================================================

    const fontChanged = (this.fontSize !== fontSize) || (this.fontFamily !== fontFamily)
    const visibilityChanged = this.hidden !== hidden

    // Font.
    // =================================================================

    if (fontChanged) {
      input.style.fontFamily = fontFamily
      input.style.fontSize = fontSize
    }

    // Visibility.
    // =================================================================

    if (visibilityChanged) {
      if (hidden) {
        container.style.display = 'none'
      } else {
        this.x = x
        this.y = y

        container.setAttribute('x', x)
        container.setAttribute('y', y)

        container.style.display = ''

        input.focus()
      }

      this.hidden = hidden
    }
  }
}

// Static attributes.
// =====================================================================

const defaultState = {
  hidden: true,
  x: 0,
  y: 0
}

staticProps(FlowViewCreator)({ defaultState })

module.exports = FlowViewCreator
