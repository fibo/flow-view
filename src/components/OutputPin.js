import React from 'react'

import bindme from 'bindme'

import Pin from './Pin'

import type {
  NodeIdAndPosition
} from './types'

import type { Props as PinProps } from './Pin'

type Props = PinProps & {
  createLink: ({ from: NodeIdAndPosition, to: ?NodeIdAndPosition }) => void
}

export default class OutputPin extends Pin<Props> {
  static defaultProps = {
    createLink: Function.prototype
  }

  constructor () {
    bindme(super(), 'onMouseDown')
  }

  onMouseDown (event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    const {
      createLink,
      nodeIdAndPosition
    } = this.props

    createLink({ from: nodeIdAndPosition })
  }

  render () {
    return (
      <Pin
        {...this.props}
        onMouseDown={this.onMouseDown}
      />
    )
  }
}
