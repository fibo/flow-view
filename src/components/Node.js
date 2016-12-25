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

    // TODO place an id in the div wrapping the body and try to
    // resolve bodyHeight from its content.

    /*

    TODO The following code works and it is ok for custom nodes.

    BUT it os not ok for server side rendering cause foreignobject
        is not supported in image context.

    return (
      <foreignObject
        height={bodyHeight}
        onClick={ignoreEvent}
        onDoubleClick={ignoreEvent}
        onMouseDown={willDragNode}
        onMouseUp={selectNode}
        transform={`translate(0,${pinSize})`}
        width={computedWidth}
      >
        <div
          style={{backgroundColor: color.body}}
        >
          <p
            style={{
              marginLeft: pinSize,
              marginRight: pinSize,
              pointerEvents: 'none'
            }}
          >
            {text}
          </p>
        </div>
      </foreignObject>
    )
    */

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
        onClick={ignoreEvent}
        onDoubleClick={ignoreEvent}
        onMouseDown={willDragNode}
        onMouseUp={selectNode}
        style={{
          cursor: (dragged ? 'pointer' : 'default')
        }}
        transform={`translate(${x},${y})`}
      >
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
          // TODO const name = (typeof pin === 'string' ? { name: pin } : pin)
          const x = xOfPin(pinSize, computedWidth, array.length, i)

          // TODO
          // const onMouseDown = (e) => {
          //   e.preventDefault()
          //   e.stopPropagation()
          //   onCreateLink({ from: null, to: [ id, i ] })
          // }

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
