const bindme = require('bindme')
const pdsp = require('pdsp')

const Pin = require('./Pin')

/**
 * An Input for a Node.
 */

class FlowViewIn extends Pin {
  constructor (frame, dispatch, container, nodeId, position) {
    super(frame, dispatch, container, nodeId, position)

    // Event bindings.
    // =================================================================

    bindme(this,
      'onMousedown',
      'onMouseover',
      'onMouseup'
    )

    container.addEventListener('mousedown', this.onMousedown)
    container.addEventListener('mouseover', this.onMouseover)
    container.addEventListener('mouseup', this.onMouseup)
  }

  onMousedown (event) {
    pdsp(event)

    // TODO
    console.log('create link')
  }

  onMouseover (event) {
    pdsp(event)

    const {
      dispatch,
      nodeId,
      position
    } = this

    dispatch('focusPin', { type: 'in', nodeId, position })
  }

  onMouseup (event) {
    pdsp(event)

    const {
      connected,
      dispatch,
      frame,
      highlighted,
      nodeId,
      position
    } = this

    if (frame.draggingLink && frame.draggedLink.from) {
      // Ins can have only a single link connected.
      if (connected) {
        dispatch('deleteHalfLink')
      } else {
        // Attach link only if data type is the same.
        if (highlighted) {
          dispatch('attachHalfLink', {
            id: frame.draggedLink.id,
            to: [nodeId, position]
          })
        } else {
          dispatch('deleteHalfLink')
        }
      }
    }
  }

  render (state) {
    super.render(state)
  }
}

module.exports = exports.default = FlowViewIn
