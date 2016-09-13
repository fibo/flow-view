import React, { PropTypes, Component } from 'react'
import ignoreEvent from '../utils/ignoreEvent'
import xOfPin from '../utils/xOfPin'

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
      ins,
      outs,
      pinSize,
      selected,
      width,
      x,
      y
    } = this.props

    const body = this.getBody()

    return (
      <g
        onClick={ignoreEvent}
        onDoubleClick={ignoreEvent}
        onMouseDown={ignoreEvent}
        style={{ cursor: (selected ? 'pointer' : 'default') }}
        transform={`translate(${x},${y})`}
      >
        <rect
          fill={fill.border}
          height={pinSize}
          width={width}
        />
        {ins.map((pin, i, array) => {
          // TODO const name = (typeof pin === 'string' ? { name: pin } : pin)
          const x = xOfPin(pinSize, width, array.length, i)

          return (
            <rect
              key={i}
              fill={fill.pin}
              height={pinSize}
              onClick={ignoreEvent}
              onMouseLeave={ignoreEvent}
              onMouseDown={ignoreEvent}
              transform={`translate(${x},0)`}
              width={pinSize}
            />
          )
        })}
        <foreignObject
          height={bodyHeight}
          onClick={ignoreEvent}
          onDoubleClick={ignoreEvent}
          onMouseDown={ignoreEvent}
          transform={`translate(0,${pinSize})`}
          width={width}
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
          width={width}
        />
        {outs.map((pin, i, array) => {
          const x = xOfPin(pinSize, width, array.length, i)

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
  ins: PropTypes.array.isRequired,
  outs: PropTypes.array.isRequired,
  pinSize: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
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
  pinSize: 10,
  selected: false,
  text: 'Node',
  width: 100
}

export default Node
