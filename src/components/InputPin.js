// @flow
import React from 'react'

import bindme from 'bindme'

import Pin from './Pin'

import type {
  NodeIdAndPosition
} from './types'
import type { Props as PinProps } from './Pin'

type Props = PinProps & {
  connectLinkToTarget: (NodeIdAndPosition) => void
}

export default class InputPin extends React.Component<Props> {
  constructor () {
    bindme(super(), 'onMouseUp')
  }

  onMouseUp (event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    const {
      connectLinkToTarget,
      nodeIdAndPosition
    } = this.props

    connectLinkToTarget(nodeIdAndPosition)
  }

  render () {
    return (
      <Pin
        {...this.props}
        onMouseUp={this.onMouseUp}
      />
    )
  }
}
