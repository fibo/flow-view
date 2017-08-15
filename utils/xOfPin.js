'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = xOfPin;
function xOfPin(pinSize, width, numPins, position) {
  if (position === 0) return 0;

  if (numPins > 1) return position * (width - pinSize) / (numPins - 1);

  throw new Error('Could not compute x coordinate of pin');
}