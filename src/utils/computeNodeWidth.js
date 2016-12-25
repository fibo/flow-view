const computeNodeWidth = ({
  bodyHeight,
  pinSize,
  fontSize,
  node
}) => {
  const ins = node.ins || []
  const outs = node.outs || []
  const text = node.text
  const width = node.width

  // Node shape defaults to a square.
  const defaultWidth = width || bodyHeight + pinSize * 2

  // Heuristic value, based on Courier font.
  const fontAspectRatio = 0.64

  // The with required to fit the node text.
  const textWidth = pinSize * 2 + text.length * fontSize * fontAspectRatio

  // The greatest number of pins, by type (ins or outs).
  const numPins = Math.max(ins.length, outs.length)

  // The width required to fit the most numerous pins.
  const pinsWidth = numPins * pinSize * 2

  const dynamicWidth = Math.max(textWidth, pinsWidth)

  const computedWidth = Math.max(defaultWidth, dynamicWidth)

  return computedWidth
}

export default computeNodeWidth
