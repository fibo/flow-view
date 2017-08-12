function computeNodeWidth (arg) {
  var bodyHeight = arg.bodyHeight // It is used only to make shapes default to square.
  var pinSize = arg.pinSize
  var fontSize = arg.fontSize
  var node = arg.node

  var ins = node.ins || []
  var outs = node.outs || []
  var text = node.text
  var width = node.width

  // Node shape defaults to a square.
  var defaultWidth = width || bodyHeight + (pinSize * 2)

  // Heuristic value, based on Courier font.
  var fontAspectRatio = 0.64

  // The with required to fit the node text.
  var textWidth = (pinSize * 2) + (text.length * fontSize * fontAspectRatio)

  // The greatest number of pins, by type (ins or outs).
  var numPins = Math.max(ins.length, outs.length)

  // The width required to fit the most numerous pins.
  var pinsWidth = numPins * pinSize * 2

  var dynamicWidth = Math.max(textWidth, pinsWidth)

  var computedWidth = Math.max(defaultWidth, dynamicWidth)

  return computedWidth
}

module.exports = exports.default = computeNodeWidth
