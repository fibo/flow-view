const staticProps = require('static-props')

const Component = require('./Component')

/**
 * The InspectorPinEditor can set inputs or outputs properties.
 */

class FlowViewInspectorPinEditor extends Component {
  constructor (canvas, dispatch, container) {
    super(canvas, dispatch, container)

    const label = this.createElement('span')

    // Static attributes.
    // =================================================================

    staticProps(this)({
      label
    })
  }

  render (state) {
    const {
      label
    } = this

    const {
      name
    } = state

    const nameChanged = this.name !== name

    // Label.
    // =================================================================

    if (nameChanged) {
      this.name = name

      label.innerHTML = name
    }
  }
}

module.exports = FlowViewInspectorPinEditor
