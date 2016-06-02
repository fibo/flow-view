import React, { PropTypes } from 'react'

const onMouseDown = () => console.log('onMouseDown')
const onMouseMove = () => console.log('onMouseMove')
const onMouseUp = () => console.log('onMouseUp')
const onMouseDownPin = (e) => {
    e.preventDefault()
    e.stopPropagation()

    console.log('onMouseDownPin')
}
const onMouseUpPin = () => console.log('onMouseUpPin')

const Node = ({
  x, y, width, height,
  fill, text,
  pinSize,
  ins, outs,
  dragged,
  dragItems,
  selectNode,
  selected,
  endDragging
}) => {
  const transform = `matrix(1,0,0,1,${x},${y})`

  const xCoordinateOfPin = (pins, position) => {
    if (position === 0) return 0

    const numPins = pins.length

    if (numPins > 1) return position * (width - pinSize) / (numPins - 1)
  }

  let highlighted = {
    stroke: 'rgb(0,0,0)',
    strokeWidth: 1
  }


  // TODO use SVG text node function getComputedTextLength

  return (
    <g
      onMouseDown={selectNode}
      onMouseUp={endDragging}
      onMouseMove={dragged ? dragItems : undefined}
      transform={transform}
    >
      <rect
        width={width}
        height={height}
        fill={fill.box}
        style={selected ? highlighted : undefined}
      ></rect>
      <text x={pinSize} y={pinSize * 2} ><tspan>{text}</tspan></text>
      {
        ins.map(
          (pin, i, array) => {
            return (
              <rect key={i}
                x={xCoordinateOfPin(ins, i)}
                y={0}
                width={pinSize}
                height={pinSize}
      onMouseDown={onMouseDownPin}
      onMouseUp={onMouseUpPin}
                fill={fill.pin}
              >
              </rect>
            )
          }
        )
      }

      {
        outs.map(
          (pin, i) => {
            return (
              <rect key={i}
                x={xCoordinateOfPin(outs, i)}
                y={height - pinSize}
                width={pinSize}
                height={pinSize}
                fill={fill.pin}
              >
              </rect>
            )
          }
        )
      }
    </g>
  )
}

Node.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  pinSize: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  fill: PropTypes.shape({
    box: PropTypes.string.isRequired,
    pin: PropTypes.string.isRequired
  }),
  ins: PropTypes.array.isRequired,
  dragged: PropTypes.bool.isRequired,
  outs: PropTypes.array.isRequired,
  selectNode: PropTypes.func.isRequired,
  endDragging: PropTypes.func.isRequired,
  dragItems: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired
}

Node.defaultProps = {
  fill: {
    box: '#cccccc',
    pin: '#333333'
  },
  pinSize: 10,
  height: 40,
  selected: false
}

export default Node
