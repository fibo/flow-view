const Component = require('./Component')

const PinEditor = require('./InspectorPinEditor')

/**
 * The InspectorPinList manages inputs or outputs.
 */

class FlowViewInspectorPinList extends Component {
  constructor (canvas, dispatch, container) {
    super(canvas, dispatch, container)

    this.pinEditorRef = []

    // DOM Elements.
    // =================================================================

    container.style.listStyleType = 'none'

    // Start hidden.
    this.hide()
  }

  createPinEditor (pinState, position) {
    const {
      canvas,
      container,
      dispatch
    } = this

    const pinEditorContainer = this.createElement('li')
    const pinEditor = new PinEditor(canvas, dispatch, pinEditorContainer)

    pinEditor.render(pinState)

    this.pinEditorRef.splice(position, 0, pinEditor)
  }

  deletePinEditor (position) {
    const {
      container,
      pinEditorRef
    } = this

    container.removeChild(container.childNodes[position])

    pinEditorRef.splice(position, 1)
  }

  render (state) {
    const {
      container
    } = this

    const {
      pins
    } = state

    // Number of pin states to render is constant, while the number
    // container.childElementCount will change after deleting pin editors.
    const numPinStates = pins.length

    // Delete old pin editors, first.
    for (let i = numPinStates; i < container.childElementCount; i++) {
      this.deletePinEditor(i)
    }

    // Render existing pin editors or create new ones.
    for (let i = 0; i < numPinStates; i++) {
      const pinEditor = this.pinEditorRef[i]

      if (pinEditor) {
        pinEditor.render(pins[i])
      } else {
        this.createPinEditor(pins[i], i)
      }
    }
  }
}

module.exports = FlowViewInspectorPinList
