import React from 'react'

import bindme from 'bindme'

export type Props = Area & {
  createNode: (SerializedNode) => void,
  nodeList: Array<string>,
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

  constructor () {
    bindme(super(),
      'onChange',
      'onClick',
      'onDoubleClick',
      'onKeyPress',
      'onMouseDown',
      'onMouseUp'
    )

    this.state = { text: '' }
  }

  inputStyle () {
    const { theme } = this.props

    const border = theme.selector.border
    const fontFamily = theme.frame.font.family
    const fontSize = theme.frame.font.size

    return {
      border: `${border.width}px ${border.style} ${border.color}`,
      fontFamily,
      fontSize,
      outline: 'none',
      width: 200
    }
  }

  onChange (event: SyntheticInputEvent<EventTarget>): void {
    this.setState({ text: event.target.value })
  }

  onClick (event: MouseEvent): void { event.stopPropagation() }

  onDoubleClick (event: MouseEvent): void { event.stopPropagation() }

  onKeyPress (event: SyntheticKeyboardEvent<EventTarget>): void {
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

  onMouseDown (event: MouseEvent): void { event.stopPropagation() }

  onMouseUp (event: MouseEvent): void { event.stopPropagation() }

  render () {
    const {
      height,
      nodeList,
      pointer,
      show,
      width
    } = this.props

    const text = this.state.text

    const hidden = { display: 'none', overflow: 'hidden' }
    const visible = { display: 'inline', overflow: 'visible' }

    const inputStyle = this.inputStyle()

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
          ref={(input) => { if (input !== null) input.focus() }}
          style={inputStyle}
          onChange={this.onChange}
          onClick={this.onClick}
          onDoubleClick={this.onDoubleClick}
          onKeyPress={this.onKeyPress}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          value={text}
        />
        {nodeList ? (
          <datalist id='nodes'>
            {nodeList.map((item, i) => (<option key={i} value={item} />))}
          </datalist>
        ) : null}
      </foreignObject>
    )
  }

  shouldComponentUpdate (nextProps: Props) {
    return this.props.show || nextProps.show
  }
}
