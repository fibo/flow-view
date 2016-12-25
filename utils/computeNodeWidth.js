(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.computeNodeWidth = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computeNodeWidth = function computeNodeWidth(_ref) {
    var bodyHeight = _ref.bodyHeight,
        pinSize = _ref.pinSize,
        fontSize = _ref.fontSize,
        node = _ref.node;

    var ins = node.ins || [];
    var outs = node.outs || [];
    var text = node.text;
    var width = node.width;

    // Node shape defaults to a square.
    var defaultWidth = width || bodyHeight + pinSize * 2;

    // Heuristic value, based on Courier font.
    var fontAspectRatio = 0.64;

    // The with required to fit the node text.
    var textWidth = pinSize * 2 + text.length * fontSize * fontAspectRatio;

    // The greatest number of pins, by type (ins or outs).
    var numPins = Math.max(ins.length, outs.length);

    // The width required to fit the most numerous pins.
    var pinsWidth = numPins * pinSize * 2;

    var dynamicWidth = Math.max(textWidth, pinsWidth);

    var computedWidth = Math.max(defaultWidth, dynamicWidth);

    return computedWidth;
  };

  exports.default = computeNodeWidth;
  module.exports = exports["default"];
});