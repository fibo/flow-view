import React from 'react'

import bindme from 'bindme'

import { defaultTheme } from './theme'

import CrossButton from './CrossButton'
import MinusButton from './MinusButton'
import PlusButton from './PlusButton'

import InputPin from './InputPin'
import OutputPin from './OutputPin'

import computeNodeWidth from '../utils/computeNodeWidth'
import xOfPin from '../utils/xOfPin'

export type Props = Point & SerializedNode & {
  bodyHeight: number,
  connectLinkToTarget: (NodeId, NodeIdAndPinPosition) => void,
  createInputPin: (NodeId) => void,
  createLink: (SemiLink) => LinkId,
  createOutputPin: (NodeId) => void,
  deleteNode: (NodeId) => void,
  deleteInputPin: (NodeId) => void,
  deleteOutputPin: (NodeId) => void,
  dragging: boolean,
  draggedLinkId: ?LinkId,
  multiSelection: boolean,
  selected: boolean,
  selectNode: (MouseEvent) => void,
  theme: Theme
}

export default class Node extends React.Component<Props> {
  static defaultProps = {
    connectLinkToTarget: Function.prototype,
    createInputPin: Function.prototype,
    createLink: Function.prototype,
    createOutputPin: Function.prototype,
    deleteNode: Function.prototype,
    deleteOutputPin: Function.prototype,
    dragging: false,
    draggedLinkId: null,
    ins: [],
    multiSelection: false,
    outs: [],
    selected: false,
    selectNode: Function.prototype,
    text: 'Node',
    theme: defaultTheme
  }

  constructor () {
    bindme(super(),
      'createInputPin',
      'createOutputPin',
      'deleteInputPin',
      'deleteNode',
      'deleteOutputPin',
      'onDoubleClick'
    )
  }

  createInputPin () { this.props.createInputPin(this.props.id) }

  createOutputPin () { this.props.createOutputPin(this.props.id) }

  deleteInputPin () { this.props.deleteInputPin(this.props.id) }

  deleteNode () { this.props.deleteNode(this.props.id) }

  deleteOutputPin () { this.props.deleteOutputPin(this.props.id) }

  getComputedWidth () {
    const {
      ins,
      outs,
      text,
      theme
    } = this.props

    const fontSize = theme.frame.font.size

    const pinSize = theme.node.pin.size

    const bodyHeight = this.getBodyHeight()

    const computedWidth = computeNodeWidth({
      bodyHeight,
      pinSize,
      fontSize,
      node: { ins, outs, text }
    })

    return computedWidth
  }

  getBodyHeight (): number {
    const {
      bodyHeight,
      theme
    } = this.props

    return bodyHeight || theme.node.body.height
  }

  onDoubleClick (event: MouseEvent) { event.stopPropagation() }

  render () {
    const {
      dragging,
      draggedLinkId,
      id,
      ins,
      connectLinkToTarget,
      createLink,
      outs,
      selected,
      selectNode,
      theme,
      x,
      y
    } = this.props

    const highlightColor = theme.frame.color.highlight
    const primaryColor = theme.frame.color.primary

    const baseColor = theme.node.color
    const bodyColor = theme.node.body.color
    const pinColor = theme.node.pin.color
    const pinSize = theme.node.pin.size

    const bodyHeight = this.getBodyHeight()
    const computedWidth = this.getComputedWidth()

    return (
      <g
        onDoubleClick={this.onDoubleClick}
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
          fill={bodyColor}
          height={bodyHeight + (2 * pinSize)}
          stroke={selected ? primaryColor : baseColor}
          strokeWidth={1}
          width={computedWidth}
        />
        <rect
          fill={selected ? primaryColor : baseColor}
          height={pinSize}
          width={computedWidth}
        />
        {ins && ins.map((pin, i, array) => {
          const x = xOfPin(pinSize, computedWidth, array.length, i)

          return (
            <InputPin key={i}
              color={selected ? highlightColor : pinColor}
              draggedLinkId={draggedLinkId}
              nodeIdAndPinPosition={{ nodeId: id, position: i }}
              connectLinkToTarget={connectLinkToTarget}
              size={pinSize}
              x={x}
              y={0}
            />
          )
        })}
        {this.renderBody()}
        <rect
          fill={selected ? primaryColor : baseColor}
          height={pinSize}
          transform={`translate(0,${pinSize + bodyHeight})`}
          width={computedWidth}
        />
        {outs && outs.map((pin, i, array) => {
          var x = xOfPin(pinSize, computedWidth, array.length, i)

          return (
            <OutputPin key={i}
              color={selected ? highlightColor : pinColor}
              createLink={createLink}
              nodeIdAndPinPosition={{ nodeId: id, position: i }}
              size={pinSize}
              x={x}
              y={pinSize + bodyHeight}
            />
          )
        })}
      </g>
    )
  }

  renderBody () {
    const {
      theme,
      text
    } = this.props

    const fontSize = theme.frame.font.size

    const pinSize = theme.node.pin.size

    const bodyHeight = this.getBodyHeight()

    // FIXME Heuristic value, based on Courier font.
    // How to get the margin pase on fonts? Maybe it could be a theme prop.
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

  renderDeleteButton () {
    const {
      multiSelection,
      selected,
      theme
    } = this.props

    const primaryColor = theme.frame.color.primary

    const pinSize = theme.node.pin.size

    if ((selected === false) || multiSelection) return null

    return (
      <CrossButton
        action={this.deleteNode}
        color={primaryColor}
        size={pinSize}
        x={-(1.5 * pinSize)}
        y={0}
      />
    )
  }

  renderInputMinus () {
    const {
      ins,
      multiSelection,
      selected,
      theme
    } = this.props

    const primaryColor = theme.frame.color.primary

    const pinSize = theme.node.pin.size

    if ((selected === false) || multiSelection) return null

    const computedWidth = this.getComputedWidth()
    const disabled = ins.length === 0

    return (
      <MinusButton
        action={this.deleteInputPin}
        color={primaryColor}
        disabled={disabled}
        size={pinSize}
        x={computedWidth + 2}
        y={0}
      />
    )
  }

  renderInputPlus () {
    const {
      multiSelection,
      selected,
      theme
    } = this.props

    const primaryColor = theme.frame.color.primary

    const pinSize = theme.node.pin.size

    if ((selected === false) || multiSelection) return null

    const computedWidth = this.getComputedWidth()

    return (
      <PlusButton
        action={this.createInputPin}
        color={primaryColor}
        size={pinSize}
        x={computedWidth + 4 + pinSize}
        y={0}
      />
    )
  }

  renderOutputMinus () {
    const {
      multiSelection,
      outs,
      selected,
      theme
    } = this.props

    const primaryColor = theme.frame.color.primary

    const pinSize = theme.node.pin.size

    if ((selected === false) || multiSelection) return null

    const bodyHeight = this.getBodyHeight()
    const computedWidth = this.getComputedWidth()
    const disabled = outs.length === 0

    return (
      <MinusButton
        action={this.deleteOutputPin}
        color={primaryColor}
        disabled={disabled}
        size={pinSize}
        x={computedWidth + 2}
        y={bodyHeight + pinSize}
      />
    )
  }

  renderOutputPlus () {
    const {
      multiSelection,
      selected,
      theme
    } = this.props

    const primaryColor = theme.frame.color.primary

    const pinSize = theme.node.pin.size

    if ((selected === false) || multiSelection) return null

    const bodyHeight = this.getBodyHeight()
    const computedWidth = this.getComputedWidth()

    return (
      <PlusButton
        action={this.createOutputPin}
        color={primaryColor}
        size={pinSize}
        x={computedWidth + 4 + pinSize}
        y={bodyHeight + pinSize}
      />
    )
  }
}
