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
    global.xOfPin = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var xOfPin = function xOfPin(pinSize, width, numPins, position) {
    if (position === 0) return 0;

    if (numPins > 1) return position * (width - pinSize) / (numPins - 1);
  };

  exports.default = xOfPin;
  module.exports = exports["default"];
});