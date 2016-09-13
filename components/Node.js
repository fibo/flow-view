(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', '../utils/ignoreEvent'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('../utils/ignoreEvent'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.ignoreEvent);
    global.Node = mod.exports;
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

  var Node = function (_Component) {
    _inherits(Node, _Component);

    function Node() {
      _classCallCheck(this, Node);

      return _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).apply(this, arguments));
    }

    _createClass(Node, [{
      key: 'getBody',
      value: function getBody() {
        var text = this.props.text;


        return _react2.default.createElement(
          'p',
          {
            style: { pointerEvents: 'none' }
          },
          text
        );
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props;
        var bodyHeight = _props.bodyHeight;
        var fill = _props.fill;
        var pinSize = _props.pinSize;
        var selected = _props.selected;
        var width = _props.width;
        var x = _props.x;
        var y = _props.y;


        var body = this.getBody();

        return _react2.default.createElement(
          'g',
          {
            onClick: _ignoreEvent2.default,
            onDoubleClick: _ignoreEvent2.default,
            onMouseDown: _ignoreEvent2.default,
            style: { cursor: selected ? 'pointer' : 'default' },
            transform: 'translate(' + x + ',' + y + ')'
          },
          _react2.default.createElement('rect', {
            fill: fill,
            height: pinSize,
            width: width
          }),
          _react2.default.createElement(
            'foreignObject',
            {
              height: bodyHeight,
              onClick: _ignoreEvent2.default,
              onDoubleClick: _ignoreEvent2.default,
              onMouseDown: _ignoreEvent2.default,
              transform: 'translate(0,' + pinSize + ')',
              width: width
            },
            body
          ),
          _react2.default.createElement('rect', {
            fill: fill,
            height: pinSize,
            transform: 'translate(0,' + (pinSize + bodyHeight) + ')',
            width: width
          })
        );
      }
    }]);

    return Node;
  }(_react.Component);

  Node.propTypes = {
    bodyHeight: _react.PropTypes.number.isRequired,
    fill: _react.PropTypes.string.isRequired,
    ins: _react.PropTypes.array.isRequired,
    outs: _react.PropTypes.array.isRequired,
    pinSize: _react.PropTypes.number.isRequired,
    selected: _react.PropTypes.bool.isRequired,
    text: _react.PropTypes.string.isRequired,
    x: _react.PropTypes.number.isRequired,
    y: _react.PropTypes.number.isRequired,
    width: _react.PropTypes.number.isRequired
  };

  Node.defaultProps = {
    bodyHeight: 20,
    fill: 'lightgray',
    ins: [],
    outs: [],
    pinSize: 10,
    selected: false,
    text: 'Node',
    width: 100
  };

  exports.default = Node;
  module.exports = exports['default'];
});