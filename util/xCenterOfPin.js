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
    global.xCenterOfPin = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var xCenterOfPin = function xCenterOfPin(pinRadius, width, numPins, position) {
    if (position === 0) return pinRadius;

    if (numPins > 1) return position * (width - pinRadius) / (numPins - 1);
  };

  exports.default = xCenterOfPin;
  module.exports = exports["default"];
});