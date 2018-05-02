const staticProps = require('static-props')

const Component = require('./Component')

const PinEditor = require('./InspectorPinEditor')

/**
 * The InspectorPinList manages inputs or outputs.
 */

class FlowViewInspectorPinList extends Component {
  constructor (canvas, dispatch, container, type) {
    super(canvas, dispatch, container)

    this.pinEditorRef = []

    // DOM Elements.
    // =================================================================

    const info = this.createElement('div')

    const pinList = this.createElement('ol')
    pinList.style.marginLeft = '1em'
    pinList.style.paddingLeft = '1em'

    // Start hidden.
    this.hide()

    // Static attributes.
    // =================================================================

    staticProps(this)({
      info,
      pinList,
      type
    })
  }

  createPinEditor (pinState, position) {
    const {
      canvas,
      dispatch,
      pinList
    } = this

    const pinEditorContainer = this.createElement('li', pinList)
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

  render (state) {
    const {
      info,
      pinList,
      type
    } = this

    const {
      nodeId,
      pins
    } = state

    // Number of pin states to render is constant, while the number
    // pinList.childElementCount will change after deleting pin editors.
    const numPins = pins.length

    const numPinChanged = numPins !== this.numPins

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
        type
      }

      if (pinEditor) {
        pinEditor.render(pinState)
      } else {
        this.createPinEditor(pinState, i)
      }
    }
  }
}

module.exports = FlowViewInspectorPinList
