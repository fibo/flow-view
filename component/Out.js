const bindme = require('bindme')
const pdsp = require('pdsp')
const staticProps = require('static-props')

const Pin = require('./Pin')

/**
 * An Output for a Node.
 */

class FlowViewOut extends Pin {
  constructor (frame, dispatch, container, nodeId, position) {
    super(frame, dispatch, container, nodeId, position)

    // Static attributes.
    // =================================================================

    staticProps(this)({
      y: () => parseInt(container.getAttribute('y'))
    })

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

    const {
      dispatch,
      frame,
      nodeId,
      position
    } = this

    frame.setCursorCoordinates(event)

    dispatch('createHalfLink', {
      cursorCoordinates: frame.cursorCoordinates,
      from: [ nodeId, position ],
      type: (this.graph.type || null)
    })
  }

  onMouseover (event) {
    pdsp(event)

    const {
      dispatch,
      nodeId,
      position
    } = this

    dispatch('focusPin', { type: 'out', nodeId, position })
  }

  onMouseup (event) {
    pdsp(event)

    const {
      dispatch,
      highlighted,
      frame,
      nodeId,
      position
    } = this

    if (frame.draggingLink && frame.draggedLink.to) {
      // Attach link only if data type is the same.
      if (highlighted) {
        dispatch('attachHalfLink', {
          id: frame.draggedLinkId,
          from: [ nodeId, position ]
        })
      } else {
        dispatch('deleteHalfLink')
      }
    }
  }

  render (state) {
    super.render(state)

    const {
      container,
      size
    } = this

    const { node } = state

    const height = node.height - size

    // Changed properties.
    // =================================================================

    const heightChanged = this.height !== height

    // Y coordinate.
    // =================================================================

    if (heightChanged) {
      container.setAttribute('y', height)
    }
  }
}

module.exports = exports.default = FlowViewOut
