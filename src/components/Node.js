// @flow
import React from 'react'

import bindme from 'bindme'
import no from 'not-defined'

import { defaultTheme, Theme } from './theme'

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

const minus = (pinSize) => (
  `M 0 ${pinSize / 3} V ${2 * pinSize / 3} H ${pinSize} V ${pinSize / 3} Z`
)

const plus = (pinSize) => (
  `M 0 ${pinSize / 3} V ${2 * pinSize / 3} H ${pinSize / 3} V ${pinSize} H ${2 * pinSize / 3} V ${2 * pinSize / 3} H ${pinSize} V ${pinSize / 3} H ${2 * pinSize / 3} V ${0} H ${pinSize / 3} V ${pinSize / 3} Z`
)

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
    updateLink: (string, { to: NodeIdAndPosition }) => void,
    width: number,
    x: number,
    y: number
  }

  static defaultProps = {
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
    theme: defaultTheme,
    updateLink: Function.prototype
  }

  constructor () {
    bindme(super(),
      'createInputPin',
      'createOutputPin',
      'deleteInputPin',
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
      createLink,
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
          const x = xOfPin(pinSize, computedWidth, array.length, i)

          var onMouseUp = (event) => {
            event.preventDefault()
            event.stopPropagation()

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
      <PlusButton
        action={this.createInputPin}
        color={primaryColor}
        disabled={false}
        size={pinSize}
        x={computedWidth + 4 + pinSize}
        y={0}
      />
    )
  }

  renderOutputMinus () {
    const {
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
      <PlusButton
        action={this.createOutputPin}
        color={primaryColor}
        disabled={false}
        size={pinSize}
        x={computedWidth + 4 + pinSize}
        y={bodyHeight + pinSize}
      />
    )
  }
}
