const bindme = require('bindme')
const staticProps = require('static-props')
const pdsp = require('pdsp')

const Component = require('./Component')

const PinEditor = require('./InspectorPinEditor')
const AddButton = require('./InspectorAddPinButton')

/**
 * The InspectorPinList manages inputs or outputs.
 */

class FlowViewInspectorPinList extends Component {
  constructor (canvas, dispatch, container, type) {
    super(canvas, dispatch, container)

    this.pinEditorRef = []

    // DOM Elements.
    // =================================================================

    const addButton = new AddButton(canvas, dispatch, this.createElementNS('svg'))
    addButton.container.style.marginLeft = '4px'
    addButton.container.style.marginRight = '4px'

    const info = this.createElement('div')
    info.style.cursor = 'default'
    info.style.display = 'inline-block'
    info.style.lineHeight = '1.5em'

    const pinList = this.createElement('div')

    // Event bindings.
    // =================================================================

    bindme(this,
      'onClickAdd'
    )

    addButton.container.addEventListener('click', this.onClickAdd)

    // Static attributes.
    // =================================================================

    staticProps(this)({
      info,
      pinList,
      type
    })

    staticProps(this.component)({
      addButton
    })
  }

  createPinEditor (pinState, position) {
    const {
      canvas,
      dispatch,
      pinList
    } = this

    const pinEditorContainer = this.createElement('div', pinList)
    const pinEditor = new PinEditor(canvas, dispatch, pinEditorContainer)

    pinEditor.render(pinState)

    this.pinEditorRef.splice(position, 0, pinEditor)
  }

  deletePinEditor (position) {
    const {
      pinList,
      pinEditorRef
    } = this

    pinList.removeChild(pinList.childNodes[position])

    pinEditorRef.splice(position, 1)
  }

  onClickAdd (event) {
    pdsp(event)

    const {
      dispatch,
      nodeId,
      numPins,
      type
    } = this

    const position = numPins + 1

    const pin = {
      name: `${type}${position}`
    }

    dispatch('createPin', { nodeId, type, position, pin })
  }

  render (state) {
    const {
      info,
      pinList,
      type
    } = this

    const {
      addButton
    } = this.component

    const {
      nodeId,
      pins,
      theme
    } = state

    // Number of pin states to render is constant, while the number
    // pinList.childElementCount will change after deleting pin editors.
    const numPins = pins.length

    // Changed properties.
    // =================================================================

    const nodeIdChanged = nodeId !== this.nodeId
    const numPinChanged = numPins !== this.numPins

    // Add button.
    // =================================================================

    addButton.render({
      theme: theme.button
    })

    // Node id.
    // =================================================================

    if (nodeIdChanged) {
      this.nodeId = nodeId
    }

    // Num pins.
    // =================================================================

    if (numPinChanged) {
      this.numPins = numPins
    }

    // Info.
    // =================================================================

    if (numPinChanged) {
      if (numPins === 0) {
        info.innerHTML = `no ${type}put`
      }

      if (numPins === 1) {
        info.innerHTML = `one ${type}put`
      }

      if (numPins > 1) {
        info.innerHTML = `${numPins} ${type}puts`
      }
    }

    // Pins.
    // =================================================================

    // Delete old pin editors, first.
    for (let i = numPins; i < pinList.childElementCount; i++) {
      this.deletePinEditor(i)
    }

    // Render existing pin editors or create new ones.
    for (let i = 0; i < numPins; i++) {
      const pinEditor = this.pinEditorRef[i]
      const pinState = {
        nodeId,
        pin: pins[i],
        position: i,
        type,
        theme
      }

      if (pinEditor) {
        pinEditor.render(pinState)
      } else {
        this.createPinEditor(pinState, i)
      }
    }
  }
}

module.exports = exports.default = FlowViewInspectorPinList
