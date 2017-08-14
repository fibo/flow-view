// @flow
import React from 'react'

import bindme from 'bindme'
import no from 'not-defined'

import { defaultTheme, Theme } from './theme'

import CrossButton from './CrossButton'
import MinusButton from './MinusButton'
import PlusButton from './PlusButton'

import computeNodeWidth from '../utils/computeNodeWidth'
import ignoreEvent from '../utils/ignoreEvent'
import xOfPin from '../utils/xOfPin'

import {
  CreatePin,
  DeleteLink,
  DeleteNode,
  DeletePin,
  Id,
  NodeIdAndPosition
} from './types'

export default class Node extends React.Component {
  props: {
    bodyHeight: number,
    createInputPin: (string) => void,
    createOutputPin: (string) => void,
    emitCreateOutputPin: CreatePin,
    emitDeleteInputPin: DeletePin,
    emitDeleteLink: DeleteLink,
    emitCreateNode: DeleteNode,
    deleteNode: (string) => void,
    deleteInputPin: (string) => void,
    deleteOutputPin: (string) => void,
    dragging: boolean,
    draggedLinkId: string,
    id: string,
    ins: Array<any>,
    multiSelection: boolean,
    outs: Array<any>,
    createLink: ({ from: NodeIdAndPosition, to?: NodeIdAndPosition }) => Id,
    selected: boolean,
    selectNode: (MouseEvent) => void,
    text: string,
    theme: Theme,
    connectLinkToTarget: (Id, NodeIdAndPosition) => void,
    width: number,
    x: number,
    y: number
  }

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

          var onMouseUp = (event) => {
            event.preventDefault()
            event.stopPropagation()

            if (draggedLinkId) {
              connectLinkToTarget(draggedLinkId, [id, i])
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

            createLink({ from: [ id, i ], to: null })
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
