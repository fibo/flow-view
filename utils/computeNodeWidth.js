'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = computeNodeWidth;
function computeNodeWidth(_ref) {
  var bodyHeight = _ref.bodyHeight,
      pinSize = _ref.pinSize,
      fontSize = _ref.fontSize,
      node = _ref.node;

  var ins = node.ins || [];
  var outs = node.outs || [];
  var text = node.text;
  var width = node.width;

  var defaultWidth = width || bodyHeight + pinSize * 2;

  var fontAspectRatio = 0.64;

  var textWidth = pinSize * 2 + text.length * fontSize * fontAspectRatio;

  var numPins = Math.max(ins.length, outs.length);

  var pinsWidth = numPins * pinSize * 2;

  var dynamicWidth = Math.max(textWidth, pinsWidth);

  var computedWidth = Math.max(defaultWidth, dynamicWidth);

  return computedWidth;
}