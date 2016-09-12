(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', '../utils/xCenterOfPin', '../utils/emptyView', './Link', './Node', './NodeSelector'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('../utils/xCenterOfPin'), require('../utils/emptyView'), require('./Link'), require('./Node'), require('./NodeSelector'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.xCenterOfPin, global.emptyView, global.Link, global.Node, global.NodeSelector);
    global.Canvas = mod.exports;
  }
})(this, function (module, exports, _react, _xCenterOfPin, _emptyView, _Link, _Node, _NodeSelector) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _xCenterOfPin2 = _interopRequireDefault(_xCenterOfPin);

  var _emptyView2 = _interopRequireDefault(_emptyView);

  var _Link2 = _interopRequireDefault(_Link);

  var _Node2 = _interopRequireDefault(_Node);

  var _NodeSelector2 = _interopRequireDefault(_NodeSelector);

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

  var Canvas = function (_Component) {
    _inherits(Canvas, _Component);

    function Canvas() {
      _classCallCheck(this, Canvas);

      var _this = _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this));

      _this.state = {
        links: [],
        pointer: { x: 0, y: 0 },
        showNodeSelector: false
      };
      return _this;
    }

    _createClass(Canvas, [{
      key: 'render',
      value: function render() {
        var _props = this.props;
        var fontFamily = _props.fontFamily;
        var fontSize = _props.fontSize;
        var height = _props.height;
        var width = _props.width;


        return _react2.default.createElement(
          'svg',
          {
            fontFamily: fontFamily,
            fontSize: fontSize,
            height: height,
            textAnchor: 'start',
            style: { border: '1px solid black' },
            width: width
          },
          _react2.default.createElement(
            'text',
            {
              x: 29,
              y: 2 + 17,
              style: { pointerEvents: 'none' }
            },
            _react2.default.createElement(
              'tspan',
              null,
              '\'Hello flow-view\''
            )
          )
        );
      }
    }]);

    return Canvas;
  }(_react.Component);

  Canvas.propTypes = {
    fontFamily: _react.PropTypes.string.isRequired,
    fontSize: _react.PropTypes.number.isRequired,
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired,
    pinRadius: _react.PropTypes.number.isRequired
  };

  Canvas.defaultProps = {
    fontFamily: 'Courier',
    fontSize: 17,
    height: 400,
    pinRadius: 6,
    width: 400
  };

  exports.default = Canvas;
  module.exports = exports['default'];
});