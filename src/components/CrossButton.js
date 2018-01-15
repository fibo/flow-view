import NodeButton from './NodeButton'

export default class CrossButton extends NodeButton {
  ray (): number {
    return this.props.size * Math.sqrt(0.47)
  }

  shape (size: number): string {
    const u = size / 6 // unit

    return `M ${4 * u} ${3 * u} L ${6 * u} ${u} L ${5 * u} 0 L ${3 * u} ${2 * u} L ${u} 0 L 0 ${u} L ${2 * u} ${3 * u} L 0 ${5 * u} L ${u} ${6 * u} L ${3 * u} ${4 * u} L ${5 * u} ${6 * u} L ${6 * u} ${5 * u} Z`
  }
}
