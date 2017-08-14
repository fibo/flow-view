// @flow
import NodeButton from './NodeButton'

export default class MinusButton extends NodeButton {
  ray (): number {
    return 1 + this.props.size / 2
  }

  shape (size: number): string {
    const u = size / 6 // unit
    const hs = Math.sqrt(2) * u / 2 // halph side

    return `M 0 ${3 * u - hs} V ${3 * u + hs} H ${size} V ${3 * u - hs} Z`
  }
}
