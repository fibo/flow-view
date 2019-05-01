const bindme = require('bindme')
const staticProps = require('static-props')

const Component = require('./Component')
const Frame = require('./Frame')
const Inspector = require('./Inspector')

/**
 * The Root contains everything inside a Canvas.
 */

class FlowViewRoot extends Component {
  constructor (canvas, dispatch, container) {
    super(canvas, dispatch, container)

    this.nodeText = {}
    this.textSize = {}

    // DOM Elements.
    // =================================================================

    container.style.display = 'flex'

    // Text size calculator.
    const textRuler = this.createElement('div')

    // Style attributes necessaries to calculate text dimensions.
    textRuler.style.height = 'auto'
    textRuler.style.width = 'auto'
    textRuler.style.position = 'absolute'
    textRuler.style.visibility = 'hidden'
    textRuler.style.whiteSpace = 'nowrap'

    const inspectorContainer = this.createElement('div')
    const inspector = new Inspector(canvas, dispatch, inspectorContainer)

    const frame = new Frame(canvas, dispatch, container)

    // Static props
    // =================================================================

    staticProps(this)({
      boundingRect: () => container.getBoundingClientRect(),
      textRuler
    })

    staticProps(this.component)({
      frame,
      inspector
    })

    // Event bindings.
    // =================================================================

    bindme(this,
      'onWindowResize'
    )

    window.addEventListener('resize', this.onWindowResize)
  }

  onWindowResize () {
    this.dispatch('resize', this.boundingRect)
  }

  render (state) {
    const {
      canvas,
      container,
      nodeText,
      textSize
    } = this

    const { graph } = state

    const { fontFamily, fontSize } = canvas.theme.frame

    const fontChanged = (this.fontSize !== fontSize) || (this.fontFamily !== fontFamily)

    // Font.
    // =================================================================

    if (fontChanged) {
      container.style.fontFamily = fontFamily
      container.style.fontSize = `${fontSize}px`
    }

    // Text sizes.
    // =================================================================

    let existingNodeIds = []

    graph.nodes.forEach(({ id, text }) => {
      existingNodeIds.push(id)

      if (nodeText[id]) {
        // Text changed.
        if (text !== nodeText[id].text) {
          nodeText[id] = text
          textSize[id] = this.sizeOfText(text)
        }
      } else {
        // New nodes.
        nodeText[id] = text
        textSize[id] = this.sizeOfText(text)
      }
    })

    Object.keys(nodeText).forEach(id => {
      // Deleted nodes.
      if (existingNodeIds.indexOf(id) === -1) {
        delete this.nodeText[id]
        delete this.textSize[id]
      }
    })

    this.renderAllSubComponents(Object.assign({}, state, { textSize }))
  }

  sizeOfText (text) {
    const { textRuler } = this

    textRuler.textContent = text

    return {
      height: textRuler.clientHeight,
      width: textRuler.clientWidth
    }
  }
}

module.exports = exports.default = FlowViewRoot
