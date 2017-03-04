(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', './Canvas', './components'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./Canvas'), require('./components'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.Canvas, global.components);
    global.flowView = mod.exports;
  }
})(this, function (module, exports, Canvas, components) {
  'use strict';

  module.exports = exports.default = { Canvas: Canvas, components: components };
});