export default function computeNodeWidth ({
  bodyHeight,
  pinSize,
  fontSize,
  node
}: {
  bodyHeight: number,
  pinSize: number,
  fontSize: number,
  node: {
    ins: Array<SerializedPin>,
    outs: Array<SerializedPin>,
    text: string
  }
}) {
  const ins = node.ins || []
  const outs = node.outs || []
  const text = node.text

  // Node shape defaults to a square.
  const defaultWidth = bodyHeight + (pinSize * 2)

  // Heuristic value, based on Courier font.
  const fontAspectRatio = 0.64

  // The width required to fit the node text.
  const textWidth = (pinSize * 2) + (text.length * fontSize * fontAspectRatio)

  // The greatest number of pins, by type (ins or outs).
  const numPins = Math.max(ins.length, outs.length)

  // The width required to fit the most numerous pins.
  const pinsWidth = numPins * pinSize * 2

  const dynamicWidth = Math.max(textWidth, pinsWidth)

  const computedWidth = Math.max(defaultWidth, dynamicWidth)

  return computedWidth
}
