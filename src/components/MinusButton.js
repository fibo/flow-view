// @flow
import NodeButton from './NodeButton'

export default class MinusButton extends NodeButton {
  shape (size: number): string {
    return `M 0 ${size / 3} V ${2 * size / 3} H ${size} V ${size / 3} Z`
  }
}
