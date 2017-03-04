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
    global.ignoreEvent = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  var ignoreEvent = function (e) {
    e.preventDefault();
    e.stopPropagation();
  };

  module.exports = exports.default = ignoreEvent;
});