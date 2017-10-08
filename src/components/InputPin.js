// @flow
import React from 'react'

import bindme from 'bindme'

import Pin from './Pin'

import type {
  ConnectLinkToTarget,
  Id
} from './types'
import type { Props as PinProps } from './Pin'

type Props = PinProps & {
  connectLinkToTarget: ConnectLinkToTarget,
  draggedLinkId: ?Id
}

export default class InputPin extends React.Component<Props> {
  static defaultProps = {
    connectLinkToTarget: Function.prototype,
    draggedLinkId: null
  }

  constructor () {
    bindme(super(), 'onMouseUp')
  }

  onMouseDown (event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
  }

  onMouseUp (event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    const {
      connectLinkToTarget,
      draggedLinkId,
      nodeIdAndPosition
    } = this.props

    if (draggedLinkId) {
      connectLinkToTarget(draggedLinkId, nodeIdAndPosition)
    }
  }

  render () {
    return (
      <Pin
        {...this.props}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      />
    )
  }
}
