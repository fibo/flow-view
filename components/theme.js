(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.theme = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var theme = {
    fontFamily: 'Courier',
    highlightColor: 'lightsteelblue',
    lineWidth: 3,
    nodeBodyHeight: 20,
    pinSize: 10
  };

  exports.default = theme;
  module.exports = exports['default'];
});