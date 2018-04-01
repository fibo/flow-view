const bindme = require('bindme')
const pdsp = require('pdsp')

const Pin = require('./Pin')

/**
 * An Input for a Node.
 */

class FlowViewIn extends Pin {
  constructor (canvas, dispatch, container, nodeId, position) {
    super(canvas, dispatch, container, nodeId, position)

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

    console.log('create link')
  }

  onMouseover (event) {
    pdsp(event)

    const {
      dispatch,
      nodeId,
      position
    } = this

    dispatch('focusPin', { type: 'In', nodeId, position })
  }

  render (state) {
    super.render(state)
  }
}

module.exports = FlowViewIn
