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
    var bodyHeight = _ref.bodyHeight;
    var pinSize = _ref.pinSize;
    var fontSize = _ref.fontSize;
    var text = _ref.text;
    var width = _ref.width;

    // Node shape defaults to a square.
    var defaultWidth = width || bodyHeight + pinSize * 2;

    // Heuristic value, based on Courier font.
    var fontAspectRatio = 0.64;

    var dynamicWidth = pinSize * 2 + text.length * fontSize * fontAspectRatio;

    var computedWidth = Math.max(defaultWidth, dynamicWidth);

    return computedWidth;
  };

  exports.default = computeNodeWidth;
  module.exports = exports["default"];
});