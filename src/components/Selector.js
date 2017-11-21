import React from 'react'

import type {
  Area,
  Point,
  SerializedNode,
  SelectorTheme
} from './types'

type Props = Area & {
  createNode: (SerializedNode) => void,
  nodelist: Array<string>,
  pointer: Point,
  show: boolean,
  theme: SelectorTheme
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

  render () {
    var {
      createNode,
      height,
      nodeList,
      pointer,
      show,
      theme,
      width
    } = this.props

    const border = theme.border

    var text = this.state.text

    var onChange = (e) => {
      var text = e.target.value

      this.setState({ text })
    }

    var onKeyPress = (e) => {
      var text = e.target.value.trim()
      var pointer = this.props.pointer

      var pressedEnter = (e.key === 'Enter')
      var textIsNotBlank = text.length > 0

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
            outline: 'none',
            border: `${border.width}px ${border.style} ${border.color}`
          }}
          onChange={onChange}
          onKeyPress={onKeyPress}
          value={text}
        />
        {nodeList ? (
          <datalist
            id='nodes'
            onChange={onChange}
          >
            {nodeList.map((item, i) => (<option key={i} value={item} />))}
          </datalist>
        ) : null}
      </foreignObject>
    )
  }
}
