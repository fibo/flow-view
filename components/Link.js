(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', '../utils/ignoreEvent', './theme'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('../utils/ignoreEvent'), require('./theme'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.ignoreEvent, global.theme);
    global.Link = mod.exports;
  }
})(this, function (module, exports, _react, _ignoreEvent, _theme) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _ignoreEvent2 = _interopRequireDefault(_ignoreEvent);

  var _theme2 = _interopRequireDefault(_theme);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var Link = function (_Component) {
    _inherits(Link, _Component);

    function Link() {
      _classCallCheck(this, Link);

      return _possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).apply(this, arguments));
    }

    _createClass(Link, [{
      key: 'render',
      value: function render() {
        var _props = this.props,
            id = _props.id,
            fill = _props.fill,
            from = _props.from,
            onCreateLink = _props.onCreateLink,
            startDraggingLinkTarget = _props.startDraggingLinkTarget,
            pinSize = _props.pinSize,
            selected = _props.selected,
            selectLink = _props.selectLink,
            to = _props.to,
            width = _props.width,
            x1 = _props.x1,
            y1 = _props.y1,
            x2 = _props.x2,
            y2 = _props.y2;


        var onSourceMouseDown = function onSourceMouseDown(e) {
          e.preventDefault();
          e.stopPropagation();

          onCreateLink({ from: from, to: null });
        };

        var onTargetMouseDown = function onTargetMouseDown(e) {
          e.preventDefault();
          e.stopPropagation();

          startDraggingLinkTarget(id);
        };

        var startX = x1 + pinSize / 2;
        var startY = y1 + pinSize / 2;
        var endX = x2 + pinSize / 2;
        var endY = y2 + pinSize / 2;

        var midPointY = (startY + endY) / 2;
        var verticalDistance = (endY - startY) / 2;

        var controlPointX1 = startX;
        var controlPointY1 = verticalDistance > 0 ? midPointY : startY - verticalDistance * 2;
        var controlPointX2 = endX;
        var controlPointY2 = verticalDistance > 0 ? midPointY : endY + verticalDistance * 2;

        return _react2.default.createElement(
          'g',
          {
            onClick: _ignoreEvent2.default,
            onDoubleClick: _ignoreEvent2.default
          },
          _react2.default.createElement('path', {
            d: 'M ' + startX + ' ' + startY + ' C ' + controlPointX1 + ' ' + controlPointY1 + ', ' + controlPointX2 + ' ' + controlPointY2 + ' ,' + endX + ' ' + endY,
            fill: 'transparent',
            onMouseUp: selectLink,
            stroke: selected ? _theme2.default.highlightColor : fill,
            strokeWidth: width
          }),
          _react2.default.createElement('rect', {
            fill: fill,
            height: pinSize,
            onMouseDown: onSourceMouseDown,
            width: pinSize,
            x: x1,
            y: y1
          }),
          to ? _react2.default.createElement('rect', {
            fill: fill,
            height: pinSize,
            onMouseDown: onTargetMouseDown,
            width: pinSize,
            x: x2,
            y: y2
          }) : null
        );
      }
    }]);

    return Link;
  }(_react.Component);

  Link.propTypes = {
    id: _react.PropTypes.string,
    fill: _react.PropTypes.string.isRequired,
    from: _react.PropTypes.array,
    onCreateLink: _react.PropTypes.func.isRequired,
    startDraggingLinkTarget: _react.PropTypes.func.isRequired,
    pinSize: _react.PropTypes.number.isRequired,
    selected: _react.PropTypes.bool.isRequired,
    selectLink: _react.PropTypes.func.isRequired,
    to: _react.PropTypes.array,
    width: _react.PropTypes.number.isRequired,
    x1: _react.PropTypes.number.isRequired,
    y1: _react.PropTypes.number.isRequired,
    x2: _react.PropTypes.number.isRequired,
    y2: _react.PropTypes.number.isRequired
  };

  Link.defaultProps = {
    fill: 'gray',
    onCreateLink: Function.prototype,
    startDraggingLinkTarget: Function.prototype,
    pinSize: _theme2.default.pinSize,
    selected: false,
    selectLink: Function.prototype,
    width: _theme2.default.lineWidth
  };

  exports.default = Link;
  module.exports = exports['default'];
});