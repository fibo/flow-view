(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './Canvas', './components'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./Canvas'), require('./components'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Canvas, global.components);
    global.flowView = mod.exports;
  }
})(this, function (exports, _Canvas, _components) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.components = exports.Canvas = undefined;

  var _Canvas2 = _interopRequireDefault(_Canvas);

  var _components2 = _interopRequireDefault(_components);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.Canvas = _Canvas2.default;
  exports.components = _components2.default;
});