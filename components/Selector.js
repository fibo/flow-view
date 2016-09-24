(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react);
    global.Selector = mod.exports;
  }
})(this, function (module, exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

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

  var hidden = { display: 'none', overflow: 'hidden' };
  var visible = { display: 'inline', overflow: 'visible' };

  var Selector = function (_Component) {
    _inherits(Selector, _Component);

    function Selector() {
      _classCallCheck(this, Selector);

      return _possibleConstructorReturn(this, (Selector.__proto__ || Object.getPrototypeOf(Selector)).apply(this, arguments));
    }

    _createClass(Selector, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props;
        var createNode = _props.createNode;
        var height = _props.height;
        var pointer = _props.pointer;
        var show = _props.show;
        var width = _props.width;


        var onKeyPress = function onKeyPress(e) {
          var text = e.target.value.trim();
          var pointer = _this2.props.pointer;

          var pressedEnter = e.key === 'Enter';
          var textIsNotBlank = text.length > 0;

          if (pressedEnter && textIsNotBlank) {
            createNode({
              text: text,
              x: pointer.x,
              y: pointer.y
            });
          }
        };

        return _react2.default.createElement(
          'foreignObject',
          {
            height: height,
            style: show ? visible : hidden,
            width: width,
            x: pointer ? pointer.x : 0,
            y: pointer ? pointer.y : 0
          },
          _react2.default.createElement('input', {
            type: 'text',
            ref: function ref(input) {
              if (input !== null) input.focus();
            },
            style: { outline: 'none' },
            onKeyPress: onKeyPress
          })
        );
      }
    }]);

    return Selector;
  }(_react.Component);

  Selector.propTypes = {
    createNode: _react.PropTypes.func.isRequired,
    show: _react.PropTypes.bool.isRequired,
    pointer: _react.PropTypes.shape({
      x: _react.PropTypes.number.isRequired,
      y: _react.PropTypes.number.isRequired
    })
  };

  Selector.defaultProps = {
    height: 20,
    width: 200
  };

  exports.default = Selector;
  module.exports = exports['default'];
});