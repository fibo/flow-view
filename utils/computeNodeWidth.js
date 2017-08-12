"use strict";

function computeNodeWidth(arg) {
  var bodyHeight = arg.bodyHeight;
  var pinSize = arg.pinSize;
  var fontSize = arg.fontSize;
  var node = arg.node;

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

module.exports = exports.default = computeNodeWidth;