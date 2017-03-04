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

  var xOfPin = function (pinSize, width, numPins, position) {
    if (position === 0) return 0;

    if (numPins > 1) return position * (width - pinSize) / (numPins - 1);
  };

  module.exports = exports.default = xOfPin;
});