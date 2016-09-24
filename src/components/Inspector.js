import React, { Component, PropTypes } from 'react'
import ignoreEvent from '../utils/ignoreEvent'

class Inspector extends Component {
  render () {
    const {
      createInputPin,
      createOutputPin,
      deleteLink,
      deleteNode,
      deleteInputPin,
      deleteOutputPin,
      items,
      view,
      width,
      x,
      y
    } = this.props

    // TODO implement multiple item selection.
    var item = null
    var itemId = null

    if (items.length === 1) {
      itemId = items[0]

      const link = view.link[itemId]
      const node = view.node[itemId]

      if (link) {
        item = (
          <div>
            link
            <button
              onClick={() => {
                deleteLink(itemId)
              }}
            >
              delete link
            </button>
          </div>
        )
      }

      if (node) {
        const ins = node.ins || []
        const outs = node.outs || []

        const lastInputPosition = ins.length - 1
        const lastOutputPosition = outs.length - 1

        var lastInputIsConnected = false
        var lastOutputIsConnected = false

        Object.keys(view.link).forEach((linkId) => {
          const link = view.link[linkId]

          if (link.to && (link.to[0] === itemId) && (link.to[1] === lastInputPosition)) {
            lastInputIsConnected = true
          }

          if ((link.from[0] === itemId) && (link.from[1] === lastOutputPosition)) {
            lastOutputIsConnected = true
          }
        })

        item = (
          <div>
            <label
              htmlFor='name'
            >
              node
            </label>
            <input
              type='text'
              id='name'
              disabled
              style={{ outline: 'none' }}
              value={node.text}
            />
            <div>
              ins
              <button
                disabled={(ins.length === 0) || lastInputIsConnected}
                onClick={() => { deleteInputPin(itemId) }}
              >-</button>
              <button
                onClick={() => { createInputPin(itemId) }}
              >+</button>
            </div>
            <div>
              outs
              <button
                disabled={(outs.length === 0) || lastOutputIsConnected}
                onClick={() => { deleteOutputPin(itemId) }}
              >-</button>
              <button
                onClick={() => { createOutputPin(itemId) }}
              >+</button>
            </div>
            <button
              onClick={() => {
                deleteNode(itemId)
              }}
            >
              delete node
            </button>
          </div>
        )
      }
    }

    return (
      <foreignObject
        onDoubleClick={ignoreEvent}
        onMouseDown={ignoreEvent}
        onMouseUp={ignoreEvent}
        width={width}
        x={x}
        y={y}
      >
        {item}
      </foreignObject>
    )
  }
}

Inspector.propTypes = {
  createInputPin: PropTypes.func.isRequired,
  createOutputPin: PropTypes.func.isRequired,
  deleteLink: PropTypes.func.isRequired,
  deleteNode: PropTypes.func.isRequired,
  deleteInputPin: PropTypes.func.isRequired,
  deleteOutputPin: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  view: PropTypes.shape({
    link: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired
  }).isRequired,
  width: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

Inspector.defaultProps = {
  createInputPin: Function.prototype,
  createOutputPin: Function.prototype,
  deleteLink: Function.prototype,
  deleteNode: Function.prototype,
  items: [],
  deleteInputPin: Function.prototype,
  deleteOutputPin: Function.prototype,
  width: 200,
  x: 0,
  y: 0
}

export default Inspector
