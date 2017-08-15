import Pin from './Pin'

export default class InputPin extends Pin {
  onMouseUp (event) {
    event.preventDefault()
    event.stopPropagation()

    const {
      connectLinkToTarget,
      nodeIdAndPosition
    } = this.props

    connectLinkToTarget(nodeIdAndPosition)
  }
}
