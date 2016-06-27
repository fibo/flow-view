(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', '../util/ignoreEvent'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('../util/ignoreEvent'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.ignoreEvent);
    global.Link = mod.exports;
  }
})(this, function (module, exports, _react, _ignoreEvent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _ignoreEvent2 = _interopRequireDefault(_ignoreEvent);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var stroke = '#333333';
  var strokeWidth = 3;
  var highlightedStrokeWidth = 4;

  var Link = function Link(_ref) {
    var x = _ref.x;
    var y = _ref.y;
    var x2 = _ref.x2;
    var y2 = _ref.y2;
    var pinRadius = _ref.pinRadius;
    var selected = _ref.selected;
    var selectLink = _ref.selectLink;
    var deleteLink = _ref.deleteLink;
    return _react2.default.createElement(
      'g',
      {
        onClick: selected ? undefined : selectLink,
        onDoubleClick: selected ? deleteLink : undefined,
        onMouseDown: _ignoreEvent2.default
      },
      _react2.default.createElement('circle', {
        cx: x,
        cy: y,
        r: strokeWidth
      }),
      _react2.default.createElement('line', {
        x1: x, y1: y, x2: x2, y2: y2,
        stroke: stroke,
        strokeWidth: selected ? highlightedStrokeWidth : strokeWidth
      }),
      _react2.default.createElement('circle', {
        cx: x2,
        cy: y2,
        r: strokeWidth
      })
    );
  };

  Link.propTypes = {
    x: _react.PropTypes.number.isRequired,
    y: _react.PropTypes.number.isRequired,
    x2: _react.PropTypes.number.isRequired,
    y2: _react.PropTypes.number.isRequired,
    deleteLink: _react.PropTypes.func,
    selectLink: _react.PropTypes.func
  };

  exports.default = Link;
  module.exports = exports['default'];
});