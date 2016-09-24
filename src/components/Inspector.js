import React, { Component, PropTypes } from 'react'
import ignoreEvent from '../utils/ignoreEvent'

class Inspector extends Component {
  render () {
    const {
      addInputPin,
      addOutputPin,
      deleteLink,
      deleteNode,
      height,
      removeInputPin,
      removeOutputPin,
      selectedItems,
      view,
      width,
      x,
      y
    } = this.props

    // TODO implement multiple item selection.
    var item = null
    var itemId = null

    if (selectedItems.length === 1) {
      itemId = selectedItems[0]

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
              remove link
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

          if ((link.to[0] === itemId) && (link.to[1] === lastInputPosition)) {
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
                onClick={() => { removeInputPin(itemId) }}
              >-</button>
              <button
                onClick={() => { addInputPin(itemId) }}
              >+</button>
            </div>
            <div>
              outs
              <button
                disabled={(outs.length === 0) || lastOutputIsConnected}
                onClick={() => { removeOutputPin(itemId) }}
              >-</button>
              <button
                onClick={() => { addOutputPin(itemId) }}
              >+</button>
            </div>
            <button
              onClick={() => {
                deleteNode(itemId)
              }}
            >
              remove node
            </button>
          </div>
        )
      }
    }

    return (
      <foreignObject
        height={height}
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
  addInputPin: PropTypes.func.isRequired,
  addOutputPin: PropTypes.func.isRequired,
  deleteLink: PropTypes.func.isRequired,
  deleteNode: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  removeInputPin: PropTypes.func.isRequired,
  removeOutputPin: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired,
  view: PropTypes.shape({
    link: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired
  }).isRequired,
  width: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

Inspector.defaultProps = {
  addInputPin: Function.prototype,
  addOutputPin: Function.prototype,
  deleteLink: Function.prototype,
  deleteNode: Function.prototype,
  removeInputPin: Function.prototype,
  removeOutputPin: Function.prototype,
  width: 200,
  x: 0,
  y: 0
}

export default Inspector
