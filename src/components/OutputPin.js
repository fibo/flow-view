import Pin from './Pin'

export default class OutputPin extends Pin {
  onMouseDown (event) {
    event.preventDefault()
    event.stopPropagation()

    const {
      createLink,
      nodeIdAndPosition
    } = this.props

    createLink({ from: nodeIdAndPosition })
  }
}
