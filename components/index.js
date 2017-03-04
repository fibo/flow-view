(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', './Frame', './Link', './Node', './Selector'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./Frame'), require('./Link'), require('./Node'), require('./Selector'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.Frame, global.Link, global.Node, global.Selector);
    global.index = mod.exports;
  }
})(this, function (module, exports, Frame, Link, Node, Selector) {
  'use strict';

  module.exports = exports.default = { Frame: Frame, Link: Link, Node: Node, Selector: Selector };
});