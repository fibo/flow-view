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

    const bodyHeight = this.props.bodyHeight || theme.nodeBodyHeight

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

  render () {
    const {
      createInputPin,
      createOutputPin,
      deleteInputPin,
      deleteNode,
      deleteOutputPin,
      dragged,
      draggedLinkId,
      fontSize,
      id,
      ins,
      onCreateLink,
      outs,
      selected,
      selectNode,
      text,
      theme,
      updateLink,
      width,
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

    const bodyHeight = this.props.bodyHeight || theme.nodeBodyHeight

    const bodyContent = this.getBody()

    const computedWidth = computeNodeWidth({
      bodyHeight,
      pinSize,
      fontSize,
      node: { ins, outs, text, width }
    })

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
        {selected ? (
          <path
            d={`M 0 ${pinSize / 3} V ${2 * pinSize / 3} H ${pinSize / 3} V ${pinSize} H ${2 * pinSize / 3} V ${2 * pinSize / 3} H ${pinSize} V ${pinSize / 3} H ${2 * pinSize / 3} V ${0} H ${pinSize / 3} V ${pinSize / 3} Z`}
            fill={highlightColor}
            transform={`translate(${pinSize / 2},${pinSize / 2}) rotate(45) translate(${-3 * pinSize / 2},${pinSize / 2})`}
            onMouseDown={() => deleteNode(id)}
          />
        ) : null}
        {selected ? (
          <path
            d={`M 0 ${pinSize / 3} V ${2 * pinSize / 3} H ${pinSize} V ${pinSize / 3} Z`}
            transform={`translate(${computedWidth + 2},0)`}
            onMouseDown={() => deleteInputPin(id)}
            fill={highlightColor}
          />
        ) : null}
        {selected ? (
          <path
            d={`M 0 ${pinSize / 3} V ${2 * pinSize / 3} H ${pinSize / 3} V ${pinSize} H ${2 * pinSize / 3} V ${2 * pinSize / 3} H ${pinSize} V ${pinSize / 3} H ${2 * pinSize / 3} V ${0} H ${pinSize / 3} V ${pinSize / 3} Z`}
            transform={`translate(${computedWidth + 4 + pinSize},0)`}
            onMouseDown={() => createInputPin(id)}
            fill={highlightColor}
          />
        ) : null}
        {selected ? (
          <path
            d={`M 0 ${pinSize / 3} V ${2 * pinSize / 3} H ${pinSize} V ${pinSize / 3} Z`}
            transform={`translate(${computedWidth + 2},${bodyHeight + pinSize})`}
            onMouseDown={() => deleteOutputPin(id)}
            fill={highlightColor}
          />
        ) : null}
        {selected ? (
          <path
            d={`M 0 ${pinSize / 3} V ${2 * pinSize / 3} H ${pinSize / 3} V ${pinSize} H ${2 * pinSize / 3} V ${2 * pinSize / 3} H ${pinSize} V ${pinSize / 3} H ${2 * pinSize / 3} V ${0} H ${pinSize / 3} V ${pinSize / 3} Z`}
            transform={`translate(${computedWidth + 4 + pinSize},${bodyHeight + pinSize})`}
            onMouseDown={() => createOutputPin(id)}
            fill={highlightColor}
          />
        ) : null}
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
