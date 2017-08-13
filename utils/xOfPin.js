'use strict'

function xOfPin (pinSize, width, numPins, position) {
  if (position === 0) return 0

  if (numPins > 1) return position * (width - pinSize) / (numPins - 1)
}

module.exports = exports.default = xOfPin
