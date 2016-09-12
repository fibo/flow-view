(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './Canvas', './Link', './Node', './NodeInspector', './NodeSelector'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./Canvas'), require('./Link'), require('./Node'), require('./NodeInspector'), require('./NodeSelector'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Canvas, global.Link, global.Node, global.NodeInspector, global.NodeSelector);
    global.index = mod.exports;
  }
})(this, function (exports, _Canvas, _Link, _Node, _NodeInspector, _NodeSelector) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NodeSelector = exports.NodeInspector = exports.Node = exports.Link = exports.Canvas = undefined;

  var _Canvas2 = _interopRequireDefault(_Canvas);

  var _Link2 = _interopRequireDefault(_Link);

  var _Node2 = _interopRequireDefault(_Node);

  var _NodeInspector2 = _interopRequireDefault(_NodeInspector);

  var _NodeSelector2 = _interopRequireDefault(_NodeSelector);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.Canvas = _Canvas2.default;
  exports.Link = _Link2.default;
  exports.Node = _Node2.default;
  exports.NodeInspector = _NodeInspector2.default;
  exports.NodeSelector = _NodeSelector2.default;
});