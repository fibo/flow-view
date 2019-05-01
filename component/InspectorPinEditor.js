const bindme = require('bindme')
const pdsp = require('pdsp')
const staticProps = require('static-props')

const Component = require('./Component')

const EditableText = require('./EditableText')
const DelButton = require('./InspectorDelPinButton')

/**
 * The InspectorPinEditor can set inputs or outputs properties.
 */

class FlowViewInspectorPinEditor extends Component {
  constructor (dispatch, container) {
    super(dispatch, container)

    // DOM Elements.
    // =================================================================

    const delButton = new DelButton(dispatch, this.createElementNS('svg'))
    delButton.svg.style.marginLeft = '1em'
    delButton.svg.style.marginRight = '4px'

    const label = new EditableText(dispatch, this.createElement('div'))

    // Event bindings.
    // =================================================================

    bindme(this,
      'onClickDelete'
    )

    delButton.svg.addEventListener('click', this.onClickDelete)

    // Static attributes.
    // =================================================================

    staticProps(this)({
      delButton,
      label
    })
  }

  onClickDelete (event) {
    pdsp(event)

    const {
      dispatch,
      nodeId,
      position,
      type
    } = this

    dispatch('deletePin', { type, nodeId, position })
  }

  render (state) {
    const {
      delButton,
      dispatch,
      label
    } = this

    const {
      nodeId,
      pin,
      position,
      type,
      theme
    } = state

    const {
      name
    } = pin

    // Changed properties.
    // =================================================================

    const nameChanged = this.name !== name
    const nodeIdChanged = this.nodeId !== nodeId
    const positionChanged = this.position !== position
    const typeChanged = this.type !== type

    // Add button.
    // =================================================================

    delButton.render({
      theme: theme.button
    })

    // Node id.
    // =================================================================

    if (nodeIdChanged) {
      this.nodeId = nodeId
    }

    // Position.
    // =================================================================

    if (positionChanged) {
      this.position = position
    }

    // Type.
    // =================================================================

    if (typeChanged) {
      this.type = type
    }

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

module.exports = exports.default = FlowViewInspectorPinEditor
