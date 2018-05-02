const staticProps = require('static-props')

const Component = require('./Component')

const EditableText = require('./EditableText')

/**
 * The InspectorPinEditor can set inputs or outputs properties.
 */

class FlowViewInspectorPinEditor extends Component {
  constructor (canvas, dispatch, container) {
    super(canvas, dispatch, container)

    const labelContainer = this.createElement('div')
    const label = new EditableText(canvas, dispatch, labelContainer)

    // Static attributes.
    // =================================================================

    staticProps(this)({
      label
    })
  }

  render (state) {
    const {
      dispatch,
      label
    } = this

    const {
      nodeId,
      pin,
      position,
      type
    } = state

    const {
      name
    } = pin

    const nameChanged = this.name !== name
    const nodeIdChanged = this.nodeId !== nodeId
    const positionChanged = this.position !== position

    // Label.
    // =================================================================

    if (nameChanged) {
      label.render({
        editable: true,
        text: name
      })

      this.name = name
    }

    if (nodeIdChanged || positionChanged) {
      label.action = (name) => {
        dispatch('renamePin', {
          type,
          nodeId,
          position,
          name
        })
      }
    }
  }
}

module.exports = FlowViewInspectorPinEditor
