import React, { PropTypes, Component } from 'react'
import ignoreEvent from '../utils/ignoreEvent'
import xOfPin from '../utils/xOfPin'
import computeNodeWidth from '../utils/computeNodeWidth'
import theme from './theme'

class Node extends Component {
  getBody () {
    const {
      fontSize,
      theme,
      text
    } = this.props

    const {
      pinSize
    } = theme

    const bodyHeight = this.getBodyHeight()

    // Heuristic value, based on Courier font.
    const margin = fontSize * 0.2

    return (
      <text
        x={pinSize}
        y={bodyHeight + pinSize - margin}
      >
        <tspan>{text}</tspan>
      </text>
    )
  }

  getBodyHeight () {
    const {
      bodyHeight,
      theme
    } = this.props

    return bodyHeight || theme.nodeBodyHeight
  }

  getComputedWidth () {
    const {
      fontSize,
      ins,
      outs,
      text,
      theme,
      width
    } = this.props

    const { pinSize } = theme

    const bodyHeight = this.getBodyHeight()

    const computedWidth = computeNodeWidth({
      bodyHeight,
      pinSize,
      fontSize,
      node: { ins, outs, text, width }
    })

    return computedWidth
  }

  getDeleteButton () {
    const {
      deleteNode,
      id,
      theme
    } = this.props

    const {
      highlightColor,
      pinSize
    } = theme

    return (
      <path
        d={`M 0 ${pinSize / 3} V ${2 * pinSize / 3} H ${pinSize / 3} V ${pinSize} H ${2 * pinSize / 3} V ${2 * pinSize / 3} H ${pinSize} V ${pinSize / 3} H ${2 * pinSize / 3} V ${0} H ${pinSize / 3} V ${pinSize / 3} Z`}
        fill={highlightColor}
        transform={`translate(${pinSize / 2},${pinSize / 2}) rotate(45) translate(${-3 * pinSize / 2},${pinSize / 2})`}
        onMouseDown={() => deleteNode(id)}
      />
    )
  }

  getInputMinus () {
    const {
      deleteInputPin,
      id,
      ins,
      theme
    } = this.props

    const {
      highlightColor,
      pinSize
    } = theme

    if (ins.length === 0) return null

    const computedWidth = this.getComputedWidth()

    return (
      <path
        d={`M 0 ${pinSize / 3} V ${2 * pinSize / 3} H ${pinSize} V ${pinSize / 3} Z`}
        transform={`translate(${computedWidth + 2},0)`}
        onMouseDown={() => deleteInputPin(id)}
        fill={highlightColor}
      />
    )
  }

  getInputPlus () {
    const {
      createInputPin,
      id,
      theme
    } = this.props

    const {
      highlightColor,
      pinSize
    } = theme

    const computedWidth = this.getComputedWidth()

    return (
      <path
        d={`M 0 ${pinSize / 3} V ${2 * pinSize / 3} H ${pinSize / 3} V ${pinSize} H ${2 * pinSize / 3} V ${2 * pinSize / 3} H ${pinSize} V ${pinSize / 3} H ${2 * pinSize / 3} V ${0} H ${pinSize / 3} V ${pinSize / 3} Z`}
        transform={`translate(${computedWidth + 4 + pinSize},0)`}
        onMouseDown={() => createInputPin(id)}
        fill={highlightColor}
      />
    )
  }

  getOutputMinus () {
    const {
      deleteOutputPin,
      id,
      outs,
      theme
    } = this.props

    if (outs.length === 0) return null

    const {
      highlightColor,
      pinSize
    } = theme

    const bodyHeight = this.getBodyHeight()
    const computedWidth = this.getComputedWidth()

    return (
      <path
        d={`M 0 ${pinSize / 3} V ${2 * pinSize / 3} H ${pinSize} V ${pinSize / 3} Z`}
        transform={`translate(${computedWidth + 2},${bodyHeight + pinSize})`}
        onMouseDown={() => deleteOutputPin(id)}
        fill={highlightColor}
      />
    )
  }

  getOutputPlus () {
    const {
      createOutputPin,
      id,
      theme
    } = this.props

    const {
      highlightColor,
      pinSize
    } = theme

    const bodyHeight = this.getBodyHeight()
    const computedWidth = this.getComputedWidth()

    return (
      <path
        d={`M 0 ${pinSize / 3} V ${2 * pinSize / 3} H ${pinSize / 3} V ${pinSize} H ${2 * pinSize / 3} V ${2 * pinSize / 3} H ${pinSize} V ${pinSize / 3} H ${2 * pinSize / 3} V ${0} H ${pinSize / 3} V ${pinSize / 3} Z`}
        transform={`translate(${computedWidth + 4 + pinSize},${bodyHeight + pinSize})`}
        onMouseDown={() => createOutputPin(id)}
        fill={highlightColor}
      />
    )
  }

  render () {
    const {
      dragged,
      draggedLinkId,
      id,
      ins,
      onCreateLink,
      outs,
      selected,
      selectNode,
      theme,
      updateLink,
      willDragNode,
      x,
      y
    } = this.props

    const {
      highlightColor,
      nodeBarColor,
      pinColor,
      pinSize
    } = theme

    const bodyContent = this.getBody()
    const bodyHeight = this.getBodyHeight()
    const computedWidth = this.getComputedWidth()

    return (
      <g
        onDoubleClick={ignoreEvent}
        onMouseDown={willDragNode}
        onMouseUp={selectNode}
        style={{
          cursor: (dragged ? 'pointer' : 'default')
        }}
        transform={`translate(${x},${y})`}
      >
        {selected ? this.getDeleteButton() : null}
        {selected ? this.getInputMinus() : null}
        {selected ? this.getInputPlus() : null}
        {selected ? this.getOutputMinus() : null}
        {selected ? this.getOutputPlus() : null}
        <rect
          fillOpacity={0}
          height={bodyHeight + 2 * pinSize}
          stroke={(selected || dragged) ? highlightColor : nodeBarColor}
          strokeWidth={1}
          width={computedWidth}
        />
        <rect
          fill={(selected || dragged) ? highlightColor : nodeBarColor}
          height={pinSize}
          width={computedWidth}
        />
        {ins.map((pin, i, array) => {
          const x = xOfPin(pinSize, computedWidth, array.length, i)

          const onMouseUp = (e) => {
            e.preventDefault()
            e.stopPropagation()

            if (draggedLinkId) {
              updateLink(draggedLinkId, { to: [id, i] })
            }
          }

          return (
            <rect
              key={i}
              fill={pinColor}
              height={pinSize}
              onMouseDown={ignoreEvent}
              onMouseUp={onMouseUp}
              transform={`translate(${x},0)`}
              width={pinSize}
            />
          )
        })}
        {bodyContent}
        <rect
          fill={(selected || dragged) ? highlightColor : nodeBarColor}
          height={pinSize}
          transform={`translate(0,${pinSize + bodyHeight})`}
          width={computedWidth}
        />
        {outs.map((pin, i, array) => {
          const x = xOfPin(pinSize, computedWidth, array.length, i)

          const onMouseDown = (e) => {
            e.preventDefault()
            e.stopPropagation()

            onCreateLink({ from: [ id, i ], to: null })
          }

          return (
            <rect
              key={i}
              fill={pinColor}
              height={pinSize}
              onClick={ignoreEvent}
              onMouseLeave={ignoreEvent}
              onMouseDown={onMouseDown}
              transform={`translate(${x},${pinSize + bodyHeight})`}
              width={pinSize}
            />
          )
        })}
      </g>
    )
  }
}

Node.propTypes = {
  bodyHeight: PropTypes.number,
  createInputPin: PropTypes.func.isRequired,
  createOutputPin: PropTypes.func.isRequired,
  deleteInputPin: PropTypes.func.isRequired,
  deleteNode: PropTypes.func.isRequired,
  deleteOutputPin: PropTypes.func.isRequired,
  dragged: PropTypes.bool.isRequired,
  draggedLinkId: PropTypes.string,
  fontSize: PropTypes.number.isRequired,
  id: PropTypes.string,
  ins: PropTypes.array.isRequired,
  outs: PropTypes.array.isRequired,
  onCreateLink: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  selectNode: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  theme: theme.propTypes,
  updateLink: PropTypes.func.isRequired,
  width: PropTypes.number,
  willDragNode: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

Node.defaultProps = {
  createInputPin: Function.prototype,
  createOutputPin: Function.prototype,
  deleteInputPin: Function.prototype,
  deleteNode: Function.prototype,
  deleteOutputPin: Function.prototype,
  dragged: false, // TODO looks more like a state
  draggedLinkId: null,
  ins: [],
  onCreateLink: Function.prototype,
  outs: [],
  selected: false,
  selectNode: Function.prototype,
  text: 'Node',
  theme: theme.defaultProps,
  updateLink: Function.prototype,
  willDragNode: Function.prototype
}

export default Node
