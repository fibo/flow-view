(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './Canvas'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./Canvas'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Canvas);
    global.flowView = mod.exports;
  }
})(this, function (exports, _Canvas) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Canvas = undefined;

  var _Canvas2 = _interopRequireDefault(_Canvas);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.Canvas = _Canvas2.default;
});