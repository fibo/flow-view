import React, { Component, PropTypes } from 'react'
import ignoreEvent from '../utils/ignoreEvent'

const pinButtonStyle = {
  borderRadius: '50%'
}

const deleteItemButtonStyle = {
  borderRadius: '2px'
}

class Inspector extends Component {
  constructor (props) {
    super(props)

    this.state = { newNodeText: null }
  }

  render () {
    const {
      items,
      view,
      width,
      x,
      y
    } = this.props

    // TODO implement multiple item selection.
    let item = null
    let itemId = null

    if (items.length === 1) {
      itemId = items[0]

      const link = view.link[itemId]
      const node = view.node[itemId]

      if (link) {
        item = this.renderLink(itemId, link)
      }

      if (node) {
        item = this.renderNode(itemId, node)
      }
    }

    return (
      <foreignObject
        onClick={() => {
          // Remove focus from input.
          document.activeElement.blur()
        }}
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

  renderLink (linkId, link) {
    const deleteLink = this.props.deleteLink

    return (
      <div>
        link
        <button
          onClick={() => {
            deleteLink(linkId)
          }}
          style={deleteItemButtonStyle}
        >
          delete link
        </button>
      </div>
    )
  }

  renderInsControls (nodeId, node) {
    const {
      createInputPin,
      deleteInputPin,
      view
    } = this.props

    const ins = node.ins || []
    const lastInputPosition = ins.length - 1
    var lastInputIsConnected = false

    Object.keys(view.link).forEach((linkId) => {
      const link = view.link[linkId]

      if (link.to && (link.to[0] === nodeId) && (link.to[1] === lastInputPosition)) {
        lastInputIsConnected = true
      }
    })

    return (
      <div>
        ins
        <button
          disabled={(ins.length === 0) || lastInputIsConnected}
          onClick={() => { deleteInputPin(nodeId) }}
          style={pinButtonStyle}
        >-</button>
        <button
          onClick={() => { createInputPin(nodeId) }}
          style={pinButtonStyle}
        >+</button>
      </div>
    )
  }

  renderOutsControls (nodeId, node) {
    const {
      createOutputPin,
      deleteOutputPin,
      view
    } = this.props

    const outs = node.outs || []
    const lastOutputPosition = outs.length - 1
    var lastOutputIsConnected = false

    Object.keys(view.link).forEach((linkId) => {
      const link = view.link[linkId]

      if ((link.from[0] === nodeId) && (link.from[1] === lastOutputPosition)) {
        lastOutputIsConnected = true
      }
    })

    return (
      <div>
        outs
        <button
          disabled={(outs.length === 0) || lastOutputIsConnected}
          onClick={() => { deleteOutputPin(nodeId) }}
          style={pinButtonStyle}
        >-</button>
        <button
          onClick={() => { createOutputPin(nodeId) }}
          style={pinButtonStyle}
        >+</button>
      </div>
    )
  }

  renderNode (nodeId, node) {
    const {
      deleteNode,
      renameNode
    } = this.props

    const setState = this.setState.bind(this)

    const newNodeText = this.state.newNodeText

    const nodeText = newNodeText || node.text

    const onChange = (e) => {
      e.preventDefault()
      e.stopPropagation()

      const text = e.target.value

      setState({ newNodeText: text })
    }

    const onKeyPress = (e) => {
      const text = nodeText.trim()

      const pressedEnter = (e.key === 'Enter')
      const textIsNotBlank = text.length > 0

      if (pressedEnter && textIsNotBlank) {
        setState({ newNodeText: null })

        renameNode(nodeId, text)
      }
    }

    const getFocus = (e) => {
      e.preventDefault()
      e.stopPropagation()

      e.target.focus()
    }

    return (
      <div>
        <label
          htmlFor='name'
        >
          node
        </label>
        <input
          type='text'
          onBlur={() => {
            const text = nodeText.trim()

            const textIsNotBlank = text.length > 0

            if (textIsNotBlank) {
              renameNode(nodeId, text)
            }

            setState({ newNodeText: text })
          }}
          onChange={onChange}
          onClick={getFocus}
          onKeyPress={onKeyPress}
          value={nodeText}
          style={{ outline: 'none' }}
        />
        {this.renderInsControls(nodeId, node)}
        {this.renderOutsControls(nodeId, node)}
        <button
          onClick={() => {
            deleteNode(nodeId)
          }}
          style={deleteItemButtonStyle}
        >
          delete node
        </button>
      </div>
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
  renameNode: PropTypes.func.isRequired,
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
  renameNode: Function.prototype,
  width: 200,
  x: 0,
  y: 0
}

export default Inspector
