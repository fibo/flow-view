(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', './Canvas', './Node', './NodeSelector', './Link'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./Canvas'), require('./Node'), require('./NodeSelector'), require('./Link'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.Canvas, global.Node, global.NodeSelector, global.Link);
    global.index = mod.exports;
  }
})(this, function (module, exports, _Canvas, _Node, _NodeSelector, _Link) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Canvas2 = _interopRequireDefault(_Canvas);

  var _Node2 = _interopRequireDefault(_Node);

  var _NodeSelector2 = _interopRequireDefault(_NodeSelector);

  var _Link2 = _interopRequireDefault(_Link);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = { Canvas: _Canvas2.default, Node: _Node2.default, Link: _Link2.default, NodeSelector: _NodeSelector2.default };
  module.exports = exports['default'];
});