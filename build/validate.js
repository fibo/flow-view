'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function validate(view) {
  if ((typeof view === 'undefined' ? 'undefined' : _typeof(view)) !== 'object') throw new TypeError();

  if (_typeof(view.node) !== 'object') throw new TypeError();

  if (_typeof(view.link) !== 'object') throw new TypeError();
}

module.exports = validate;