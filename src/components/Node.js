import React, { PropTypes } from 'react'
import ignoreEvent from '../util/ignoreEvent'

const highlighted = {
  stroke: 'black',
  strokeWidth: 1
}

const fill = 'lightgray'
const styles = {
  defaultPin: { stroke: 'black', strokeWidth: 1 }
}

const Node = ({
  id,
  x, y, width, height,
  text,
  pinRadius,
  ins, outs,
  draggedLinkId,
  isDraggingLink,
  addLink,
  selectNode,
  selected,
  endDragging,
  endDraggingLink
}) => (
  <g
    onClick={ignoreEvent}
    onMouseDown={selectNode}
    transform={`matrix(1,0,0,1,${x},${y})`}
    style={{
      cursor: (selected ? 'pointer' : 'default')
    }}
  >
    <rect
      rx={pinRadius}
      ry={pinRadius}
      width={width}
      height={height}
      fill={fill}
      style={selected ? highlighted : undefined}
    ></rect>

    <text
      x={pinRadius * 2}
      y={height / 2}
      style={{pointerEvents: 'none'}}
    >
      <tspan>{text}</tspan>
    </text>

    {
      ins.map(
        (pin, i, array) => (
          <circle
            key={i}
            cx={pin.cx}
            cy={pin.cy}
            r={pin.r}
            fill={fill}
            onClick={ignoreEvent}
            onMouseLeave={ignoreEvent}
            onMouseDown={ignoreEvent}
            onMouseUp={isDraggingLink ? endDraggingLink(draggedLinkId, { to: [ id, i ] }) : undefined}
            style={styles.defaultPin}
          >
          </circle>
        )
      )
    }

    {
      outs.map(
        (pin, i) => (
          <circle
            key={i}
            cx={pin.cx}
            cy={pin.cy}
            r={pin.r}
            fill={fill}
            style={styles.defaultPin}
            onClick={ignoreEvent}
            onMouseDown={addLink([id, i], null)}
            onMouseUp={ignoreEvent}
            onMouseLeave={ignoreEvent}
          >
          </circle>
        )
      )
    }
  </g>
)

Node.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  pinRadius: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  ins: PropTypes.array.isRequired,
  outs: PropTypes.array.isRequired,
  selectNode: PropTypes.func.isRequired,
  endDragging: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  addLink: PropTypes.func.isRequired
}

Node.defaultProps = {
  selected: false
}

export default Node
