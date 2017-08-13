// @flow
import NodeButton from './NodeButton'

export default class PlusButton extends NodeButton {
  shape (size: number): string {
    return `M 0 ${size / 3} V ${2 * size / 3} H ${size / 3} V ${size} H ${2 * size / 3} V ${2 * size / 3} H ${size} V ${size / 3} H ${2 * size / 3} V ${0} H ${size / 3} V ${size / 3} Z`
  }
}
