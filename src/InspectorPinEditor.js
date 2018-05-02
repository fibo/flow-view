const bindme = require('bindme')
const staticProps = require('static-props')

const Component = require('./Component')

const EditableText = require('./EditableText')

/**
 * The InspectorPinEditor can set inputs or outputs properties.
 */

class FlowViewInspectorPinEditor extends Component {
  constructor (canvas, dispatch, container) {
    super(canvas, dispatch, container)

    // DOM Elements.
    // =================================================================

    const rowContainer = this.createElement('div')

    const deleteButton = this.createElement('button', rowContainer)
    deleteButton.style.borderRadius = '2px'
    deleteButton.style.marginLeft = '1px'
    deleteButton.style.marginRight = '4px'
    deleteButton.style.outline = 'none'
    deleteButton.innerHTML = 'x'

    const label = new EditableText(canvas, dispatch, rowContainer)

    // Event bindings.
    // =================================================================

    bindme(this,
      'onClickDelete'
    )

    container.addEventListener('click', this.onClickDelete)

    // Static attributes.
    // =================================================================

    staticProps(this)({
      label
    })
  }

  onClickDelete () {
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
    const typeChanged = this.type !== type

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

module.exports = FlowViewInspectorPinEditor
