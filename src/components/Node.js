import React from 'react'

import bindme from 'bindme'
import no from 'not-defined'

import { defaultTheme } from './theme'

import CrossButton from './CrossButton'
import MinusButton from './MinusButton'
import PlusButton from './PlusButton'

import InputPin from './InputPin'
import OutputPin from './OutputPin'

import type { Theme } from './theme'
import type {
  CreatePin,
  DeleteLink,
  DeleteNode,
  DeletePin,
  Id,
  NodeIdAndPosition,
  Point,
  SerializedNode
} from './types'

import computeNodeWidth from '../utils/computeNodeWidth'
import ignoreEvent from '../utils/ignoreEvent'
import xOfPin from '../utils/xOfPin'

type Props = Point & SerializedNode & {
  bodyHeight: number,
  connectLinkToTarget: (Id, NodeIdAndPosition) => void,
  createInputPin: (Id) => void,
  createLink: ({ from: NodeIdAndPosition, to: ?NodeIdAndPosition }) => Id,
  createOutputPin: (Id) => void,
  emitCreateOutputPin: CreatePin,
  emitDeleteInputPin: DeletePin,
  emitDeleteLink: DeleteLink,
  emitCreateNode: DeleteNode,
  deleteNode: (Id) => void,
  deleteInputPin: (Id) => void,
  deleteOutputPin: (Id) => void,
  dragging: boolean,
  draggedLinkId: string,
  id: string,
  multiSelection: boolean,
  selected: boolean,
  selectNode: (MouseEvent) => void,
  theme: Theme,
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
    multiSelection: false,
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
      'deleteOutputPin'
    )
  }

  createInputPin () {
    this.props.createInputPin(this.props.id)
  }

  createOutputPin () {
    this.props.createOutputPin(this.props.id)
  }

  deleteInputPin () {
    this.props.deleteInputPin(this.props.id)
  }

  deleteNode () {
    this.props.deleteNode(this.props.id)
  }

  deleteOutputPin () {
    this.props.deleteOutputPin(this.props.id)
  }

  getComputedWidth () {
    const {
      ins,
      outs,
      text,
      theme,
      width
    } = this.props

    const {
      fontSize,
      pinSize
    } = theme

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
      connectLinkToTarget,
      createLink,
      outs,
      selected,
      selectNode,
      theme,
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
          const x = xOfPin(pinSize, computedWidth, array.length, i)

          return (
            <InputPin key={i}
              color={selected ? darkPrimaryColor : pinColor}
              nodeIdAndPosition={[id, i]}
              connectLinkToTarget={draggedLinkId ? connectLinkToTarget.bind(null, draggedLinkId) : null}
              size={pinSize}
              x={x}
              y={0}
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

          return (
            <OutputPin key={i}
              color={selected ? darkPrimaryColor : pinColor}
              createLink={createLink}
              nodeIdAndPosition={[id, i]}
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

    const {
      fontSize,
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

  renderDeleteButton () {
    const {
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

    const {
      primaryColor,
      pinSize
    } = theme

    if (no(ins) || (selected === false) || multiSelection) return null

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

    const {
      primaryColor,
      pinSize
    } = theme

    if (no(outs) || (selected === false) || multiSelection) return null

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
