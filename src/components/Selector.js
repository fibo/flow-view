import React from 'react'

import bindme from 'bindme'

import type {
  Area,
  Point,
  SerializedNode,
  Theme
} from './types'

type Props = Area & {
  createNode: (SerializedNode) => void,
  nodelist: Array<string>,
  pointer: Point,
  show: boolean,
  theme: Theme
}

type State = {
  text: string
}

export default class Selector extends React.Component<Props, State> {
  static defaultProps = {
    height: 20,
    width: 200
  }

  state = { text: '' }

  constructor () {
    bindme(super(),
      'onChange',
      'onKeyPress'
    )
  }

  onChange (event): void {
    this.setState({ text: event.target.value })
  }

  onKeyPress (event): void {
    const {
      createNode,
      pointer
    } = this.props

    const text = event.target.value.trim()

    const pressedEnter = (event.key === 'Enter')
    const textIsNotBlank = text.length > 0

    if (pressedEnter) {
      if (textIsNotBlank) {
        createNode({
          ins: [],
          outs: [],
          text,
          x: pointer.x,
          y: pointer.y
        })
      }

      this.setState({ text: '' })
    }
  }

  render () {
    const {
      height,
      nodeList,
      pointer,
      show,
      theme,
      width
    } = this.props

    const border = theme.selector.border
    const fontFamily = theme.frame.font.family
    const fontSize = theme.frame.font.size

    const text = this.state.text

    const hidden = { display: 'none', overflow: 'hidden' }
    const visible = { display: 'inline', overflow: 'visible' }

    return (
      <foreignObject
        height={height}
        style={(show ? visible : hidden)}
        width={width}
        x={pointer ? pointer.x : 0}
        y={pointer ? pointer.y : 0}
      >
        <input
          list='nodes'
          type='text'
          ref={(input) => {
            if (input !== null) input.focus()
          }}
          style={{
            border: `${border.width}px ${border.style} ${border.color}`,
            fontFamily,
            fontSize,
            outline: 'none'
          }}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
          value={text}
        />
        {nodeList ? (
          <datalist
            id='nodes'
            onChange={this.onChange}
          >
            {nodeList.map((item, i) => (<option key={i} value={item} />))}
          </datalist>
        ) : null}
      </foreignObject>
    )
  }
}
