import React from 'react'

import no from 'not-defined'

import { defaultTheme, Theme } from './theme'

import computeNodeWidth from '../utils/computeNodeWidth'
import ignoreEvent from '../utils/ignoreEvent'
import xOfPin from '../utils/xOfPin'

const minus = (pinSize) => (
  `M 0 ${pinSize / 3} V ${2 * pinSize / 3} H ${pinSize} V ${pinSize / 3} Z`
)

const plus = (pinSize) => (
  `M 0 ${pinSize / 3} V ${2 * pinSize / 3} H ${pinSize / 3} V ${pinSize} H ${2 * pinSize / 3} V ${2 * pinSize / 3} H ${pinSize} V ${pinSize / 3} H ${2 * pinSize / 3} V ${0} H ${pinSize / 3} V ${pinSize / 3} Z`
)

export default class Node extends React.Component {
/*
Node.propTypes = {
  bodyHeight: PropTypes.number,
  createInputPin: PropTypes.func.isRequired,
  createOutputPin: PropTypes.func.isRequired,
  deleteInputPin: PropTypes.func.isRequired,
  deleteNode: PropTypes.func.isRequired,
  deleteOutputPin: PropTypes.func.isRequired,
  dragging: PropTypes.bool.isRequired,
  draggedLinkId: PropTypes.string,
  fontSize: PropTypes.number.isRequired,
  id: PropTypes.string,
  ins: PropTypes.array,
  multiSelection: PropTypes.bool.isRequired,
  outs: PropTypes.array,
  onCreateLink: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  selectNode: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
//  theme: theme.propTypes,
  updateLink: PropTypes.func.isRequired,
  width: PropTypes.number,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}
*/

  static defaultProps = {
    createInputPin: Function.prototype,
    createOutputPin: Function.prototype,
    deleteInputPin: Function.prototype,
    deleteNode: Function.prototype,
    deleteOutputPin: Function.prototype,
    dragging: false,
    draggedLinkId: null,
    multiSelection: false,
    onCreateLink: Function.prototype,
    selected: false,
    selectNode: Function.prototype,
    text: 'Node',
    theme: defaultTheme,
    updateLink: Function.prototype
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

    var { pinSize } = theme

    const bodyHeight = this.getBodyHeight()

    const computedWidth = computeNodeWidth({
      bodyHeight,
      pinSize,
      fontSize,
      node: { ins, outs, text, width }
    })

    return computedWidth
  }

  getBodyHeight () {
    const {
      bodyHeight,
      theme
    } = this.props

    return bodyHeight || theme.nodeBodyHeight
  }

  render () {
    const {
      dragging,
      draggedLinkId,
      id,
      ins,
      onCreateLink,
      outs,
      selected,
      selectNode,
      theme,
      updateLink,
      x,
      y
    } = this.props

    const {
      darkPrimaryColor,
      nodeBarColor,
      pinColor,
      pinSize,
      primaryColor
    } = theme

    const bodyHeight = this.getBodyHeight()
    const computedWidth = this.getComputedWidth()

    return (
      <g
        onDoubleClick={ignoreEvent}
        onMouseDown={selectNode}
        style={{
          cursor: (dragging ? 'pointer' : 'default')
        }}
        transform={`translate(${x},${y})`}
      >
        {this.renderDeleteButton()}
        {this.renderInputMinus()}
        {this.renderInputPlus()}
        {this.renderOutputMinus()}
        {this.renderOutputPlus()}
        <rect
          fillOpacity={0}
          height={bodyHeight + (2 * pinSize)}
          stroke={selected ? primaryColor : nodeBarColor}
          strokeWidth={1}
          width={computedWidth}
        />
        <rect
          fill={selected ? primaryColor : nodeBarColor}
          height={pinSize}
          width={computedWidth}
        />
        {ins && ins.map((pin, i, array) => {
          var x = xOfPin(pinSize, computedWidth, array.length, i)

          var onMouseUp = (e) => {
            e.preventDefault()
            e.stopPropagation()

            if (draggedLinkId) {
              updateLink(draggedLinkId, { to: [id, i] })
            }
          }

          return (
            <rect
              key={i}
              fill={selected ? darkPrimaryColor : pinColor}
              height={pinSize}
              onMouseDown={ignoreEvent}
              onMouseUp={onMouseUp}
              transform={`translate(${x},0)`}
              width={pinSize}
            />
          )
        })}
        {this.renderBody()}
        <rect
          fill={selected ? primaryColor : nodeBarColor}
          height={pinSize}
          transform={`translate(0,${pinSize + bodyHeight})`}
          width={computedWidth}
        />
        {outs && outs.map((pin, i, array) => {
          var x = xOfPin(pinSize, computedWidth, array.length, i)

          var onMouseDown = (e) => {
            e.preventDefault()
            e.stopPropagation()

            onCreateLink({ from: [ id, i ], to: null })
          }

          return (
            <rect
              key={i}
              fill={selected ? darkPrimaryColor : pinColor}
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

  renderBody () {
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
    var margin = fontSize * 0.2

    return (
      <text
        x={pinSize}
        y={bodyHeight + pinSize - margin}
      >
        <tspan>{text}</tspan>
      </text>
    )
  }

  renderDeleteButton () {
    const {
      deleteNode,
      id,
      multiSelection,
      selected,
      theme
    } = this.props

    const {
      primaryColor,
      pinSize
    } = theme

    if ((selected === false) || multiSelection) return null

    return (
      <path
        d={`M 0 ${pinSize / 3} V ${2 * pinSize / 3} H ${pinSize / 3} V ${pinSize} H ${2 * pinSize / 3} V ${2 * pinSize / 3} H ${pinSize} V ${pinSize / 3} H ${2 * pinSize / 3} V ${0} H ${pinSize / 3} V ${pinSize / 3} Z`}
        fill={primaryColor}
        transform={`translate(${pinSize / 2},${pinSize / 2}) rotate(45) translate(${-3 * pinSize / 2},${pinSize / 2})`}
        onMouseDown={() => deleteNode(id)}
      />
    )
  }

  renderInputMinus () {
    const {
      deleteInputPin,
      id,
      ins,
      multiSelection,
      selected,
      theme
    } = this.props

    const {
      primaryColor,
      pinSize
    } = theme

    if (no(ins) || (selected === false) || multiSelection) return null

    const computedWidth = this.getComputedWidth()
    const disabled = ins.length === 0

    return (
      <path
        d={minus(pinSize)}
        fill={disabled ? 'transparent' : primaryColor}
        onMouseDown={() => {
          if (!disabled) deleteInputPin(id)
        }}
        stroke={primaryColor}
        transform={`translate(${computedWidth + 2},0)`}
      />
    )
  }

  renderInputPlus () {
    const {
      createInputPin,
      id,
      ins,
      multiSelection,
      selected,
      theme
    } = this.props

    const {
      primaryColor,
      pinSize
    } = theme

    if (no(ins) || (selected === false) || multiSelection) return null

    const computedWidth = this.getComputedWidth()

    return (
      <path
        d={plus(pinSize)}
        fill={primaryColor}
        onMouseDown={() => createInputPin(id)}
        stroke={primaryColor}
        transform={`translate(${computedWidth + 4 + pinSize},0)`}
      />
     )
  }

  renderOutputMinus () {
    const {
      deleteOutputPin,
      id,
      multiSelection,
      outs,
      selected,
      theme
    } = this.props

    const {
      primaryColor,
      pinSize
    } = theme

    if (no(outs) || (selected === false) || multiSelection) return null

    const bodyHeight = this.getBodyHeight()
    const computedWidth = this.getComputedWidth()
    const disabled = outs.length === 0

    return (
      <path
        d={minus(pinSize)}
        fill={disabled ? 'transparent' : primaryColor}
        onMouseDown={() => {
          if (!disabled) deleteOutputPin(id)
        }}
        stroke={primaryColor}
        transform={`translate(${computedWidth + 2},${bodyHeight + pinSize})`}
      />
    )
  }

  renderOutputPlus () {
    const {
      createOutputPin,
      id,
      multiSelection,
      outs,
      selected,
      theme
    } = this.props

    const {
      primaryColor,
      pinSize
    } = theme

    if (no(outs) || (selected === false) || multiSelection) return null

    const bodyHeight = this.getBodyHeight()
    const computedWidth = this.getComputedWidth()

    return (
      <path
        d={plus(pinSize)}
        fill={primaryColor}
        onMouseDown={() => createOutputPin(id)}
        stroke={primaryColor}
        transform={`translate(${computedWidth + 4 + pinSize},${bodyHeight + pinSize})`}
      />
    )
  }
}
