import React, { PropTypes, Component } from 'react'
import ignoreEvent from '../utils/ignoreEvent'
import xOfPin from '../utils/xOfPin'
import theme from './theme'

class Node extends Component {
  getBody () {
    const {
      pinSize,
      text
    } = this.props

    return (
      <p
        style={{
          marginLeft: pinSize,
          marginRight: pinSize,
          pointerEvents: 'none'
        }}
      >
        {text}
      </p>
    )
  }

  render () {
    const {
      bodyHeight,
      fill,
      fontSize,
      ins,
      outs,
      pinSize,
      selected,
      selectNode,
      text,
      x,
      y
    } = this.props

    const body = this.getBody()

    // Node shape defaults to a square.
    const width = this.props.width || bodyHeight + pinSize * 2

    // Heuristic value, based on Courier font.
    const fontAspectRatio = 0.64

    const dynamicWidth = pinSize * 2 + text.length * fontSize * fontAspectRatio

    const computedWidth = Math.max(width, dynamicWidth)

    return (
      <g
        onClick={ignoreEvent}
        onDoubleClick={ignoreEvent}
        onMouseDown={selectNode}
        style={{ cursor: (selected ? 'pointer' : 'default') }}
        transform={`translate(${x},${y})`}
      >
        <rect
          fill={fill.border}
          height={pinSize}
          width={computedWidth}
        />
        {ins.map((pin, i, array) => {
          // TODO const name = (typeof pin === 'string' ? { name: pin } : pin)
          const x = xOfPin(pinSize, computedWidth, array.length, i)

          return (
            <rect
              key={i}
              fill={fill.pin}
              height={pinSize}
              onClick={ignoreEvent}
              onMouseLeave={ignoreEvent}
              onMouseDown={selectNode}
              transform={`translate(${x},0)`}
              width={pinSize}
            />
          )
        })}
        <foreignObject
          height={bodyHeight}
          onClick={ignoreEvent}
          onDoubleClick={ignoreEvent}
          onMouseDown={selectNode}
          transform={`translate(0,${pinSize})`}
          width={computedWidth}
        >
          <div
            style={{backgroundColor: fill.body}}
          >
            {body}
          </div>
        </foreignObject>
        <rect
          fill={fill.border}
          height={pinSize}
          transform={`translate(0,${pinSize + bodyHeight})`}
          width={computedWidth}
        />
        {outs.map((pin, i, array) => {
          const x = xOfPin(pinSize, computedWidth, array.length, i)

          return (
            <rect
              key={i}
              fill={fill.pin}
              height={pinSize}
              onClick={ignoreEvent}
              onMouseLeave={ignoreEvent}
              onMouseDown={ignoreEvent}
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
  bodyHeight: PropTypes.number.isRequired,
  fill: PropTypes.shape({
    body: PropTypes.string.isRequired,
    border: PropTypes.string.isRequired,
    pin: PropTypes.string.isRequired
  }).isRequired,
  fontSize: PropTypes.number.isRequired,
  ins: PropTypes.array.isRequired,
  outs: PropTypes.array.isRequired,
  pinSize: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  width: PropTypes.number,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

Node.defaultProps = {
  bodyHeight: 20,
  fill: {
    body: 'whitesmoke',
    border: 'lightgray',
    pin: 'gray'
  },
  ins: [],
  outs: [],
  pinSize: theme.pinSize,
  selected: false,
  selectNode: Function.prototype,
  text: 'Node'
}

export default Node
