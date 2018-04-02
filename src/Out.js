const bindme = require('bindme')
const pdsp = require('pdsp')
const staticProps = require('static-props')

const Pin = require('./Pin')

/**
 * An Output for a Node.
 */

class FlowViewOut extends Pin {
  constructor (canvas, frame, dispatch, container, nodeId, position) {
    super(canvas, frame, dispatch, container, nodeId, position)

    // Static attributes.
    // =================================================================

    staticProps(this)({
      y: () => parseInt(container.getAttribute('y'))
    })

    // Event bindings.
    // =================================================================

    bindme(this,
      'onMousedown',
      'onMouseover'
    )

    container.addEventListener('mousedown', this.onMousedown)
    container.addEventListener('mouseover', this.onMouseover)
  }

  onMousedown (event) {
    pdsp(event)

    const {
      dispatch,
      frame,
      nodeId,
      position
    } = this

    frame.setCursorCoordinates(event)

    dispatch('createLink', { from: [ nodeId, position ] })
  }

  onMouseover (event) {
    pdsp(event)

    const {
      dispatch,
      nodeId,
      position
    } = this

    dispatch('focusPin', { type: 'Out', nodeId, position })
  }

  render (state) {
    super.render(state)

    const {
      container,
      size
    } = this

    const { node } = state

    // Y coordinate.
    // =================================================================

    if (node.heightChanged) {
      container.setAttribute('y', node.height - size)
    }
  }
}

module.exports = FlowViewOut
