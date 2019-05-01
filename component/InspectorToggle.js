const bindme = require('bindme')
const staticProps = require('static-props')

const Component = require('./Component')

/**
 * The Inspector let user modify Node properties.
 */

class FlowViewInspectorToggle extends Component {
  constructor (dispatch, container) {
    super(dispatch, container)

    // DOM Elements.
    // =================================================================

    const toggle = this.createElement('div')

    toggle.innerHTML = '👁'
    toggle.style.fontSize = 15
    toggle.style.padding = 2

    // Event bindings.
    // ==================================================================

    bindme(this, 'onMouseEnter')

    toggle.addEventListener('mouseenter', this.onMouseEnter)

    // Static attributes.
    // =================================================================

    staticProps(this)({ toggle })
  }

  onMouseEnter () { this.dispatch('showInspector') }

  render (state) {
    const { toggle } = this

    const inspectorHidden = state.inspector.hidden

    // Changed properties.
    // =================================================================

    const visibilityChanged = this.hidden !== !inspectorHidden

    if (visibilityChanged) {
      this.hidden = !inspectorHidden

      if (inspectorHidden) {
        toggle.style.display = ''
      } else {
        toggle.style.display = 'none'
      }
    }
  }
}

module.exports = exports.default = FlowViewInspectorToggle
