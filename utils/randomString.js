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
    global.randomString = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  /**
   * Generate random string [a-z].
   *
   * @param {Number} length of desired result
   * @returns {String} result
   */

  var randomString = function (length) {
    var result = '';

    while (result.length < length) {
      result += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }

    return result;
  };

  module.exports = exports.default = randomString;
});