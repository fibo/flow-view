import NodeButton from './NodeButton'

const ray = (size: number): number => {
  return 1 + size / 2
}

const shape = (size: number): string => {
  const u = size / 6 // unit
  const hs = Math.sqrt(2) * u / 2 // halph side

  return `M 0 ${3 * u - hs} V ${3 * u + hs} H ${3 * u - hs} V ${size} H ${3 * u + hs} V ${3 * u + hs} H ${size} V ${3 * u - hs} H ${3 * u + hs} V 0 H ${3 * u - hs} V ${3 * u - hs} Z`
}

export default class PlusButton extends NodeButton {
  static defaultProps = {
    action: Function.prototype,
    disabled: false,
    ray,
    shape
  }
}
