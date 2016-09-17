
const computeNodeWidth = ({
  bodyHeight,
  pinSize,
  fontSize,
  text,
  width
}) => {
  // Node shape defaults to a square.
  const defaultWidth = width || bodyHeight + pinSize * 2

  // Heuristic value, based on Courier font.
  const fontAspectRatio = 0.64

  const dynamicWidth = pinSize * 2 + text.length * fontSize * fontAspectRatio

  const computedWidth = Math.max(defaultWidth, dynamicWidth)

  return computedWidth
}

export default computeNodeWidth
