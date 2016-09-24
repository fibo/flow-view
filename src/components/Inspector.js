import React, { Component, PropTypes } from 'react'
import ignoreEvent from '../utils/ignoreEvent'

class Inspector extends Component {
  render () {
    const {
      deleteLink,
      deleteNode,
      height,
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
        const click = () => {
          console.log('click')
        }

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
                onClick={click}
              >-</button>
              <button>+</button>
            </div>
            <div>
              outs
              <button>-</button>
              <button>+</button>
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
  deleteLink: PropTypes.func.isRequired,
  deleteNode: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
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
  deleteLink: Function.prototype,
  deleteNode: Function.prototype,
  width: 200,
  x: 0,
  y: 0
}

export default Inspector
