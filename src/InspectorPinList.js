const Component = require('./Component')

const PinEditor = require('./InspectorPinEditor')

/**
 * The InspectorPinList manages inputs or outputs.
 */

class FlowViewInspectorPinList extends Component {
  constructor (canvas, dispatch, container) {
    super(canvas, dispatch, container)

    this.pinRef = []

    // Start hidden.
    this.hide()
  }

  // TODO createPin deletePin

  render (state) {
    const {
      canvas,
      container,
      dispatch
    } = this

    const {
      pins
    } = state

    const numChildren = container.childElementCount
    const numPins = pins.length

    // Create new pin editors.
    for (let i = numChildren; i < numPins; i++) {
      const pinEditorContainer = this.createElement('li')
      this.pinRef[i] = new PinEditor(canvas, dispatch, pinEditorContainer)
    }

    // Delete old pin editors.
    for (let i = numPins; i < numChildren; i++) {
      // TODO
    }

    // Render existing pin editors.
    this.pinRef.forEach((pin, i) => { pin.render(pins[i]) })
  }
}

module.exports = FlowViewInspectorPinList
