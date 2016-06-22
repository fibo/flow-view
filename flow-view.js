(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './Canvas', './actions', './components', './reducers'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./Canvas'), require('./actions'), require('./components'), require('./reducers'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Canvas, global.actions, global.components, global.reducers);
    global.flowView = mod.exports;
  }
})(this, function (exports, _Canvas, _actions, _components, _reducers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.reducers = exports.components = exports.actions = exports.Canvas = undefined;

  var _Canvas2 = _interopRequireDefault(_Canvas);

  var _actions2 = _interopRequireDefault(_actions);

  var _components2 = _interopRequireDefault(_components);

  var _reducers2 = _interopRequireDefault(_reducers);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.Canvas = _Canvas2.default;
  exports.actions = _actions2.default;
  exports.components = _components2.default;
  exports.reducers = _reducers2.default;
});