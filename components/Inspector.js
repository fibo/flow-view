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
    global.Inspector = mod.exports;
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

  var Inspector = function (_Component) {
    _inherits(Inspector, _Component);

    function Inspector(props) {
      _classCallCheck(this, Inspector);

      var _this = _possibleConstructorReturn(this, (Inspector.__proto__ || Object.getPrototypeOf(Inspector)).call(this, props));

      _this.state = {
        newNodeText: null
      };
      return _this;
    }

    _createClass(Inspector, [{
      key: 'render',
      value: function render() {
        var _props = this.props,
            items = _props.items,
            view = _props.view,
            width = _props.width,
            x = _props.x,
            y = _props.y;


        // TODO implement multiple item selection.
        var item = null;
        var itemId = null;

        if (items.length === 1) {
          itemId = items[0];

          var link = view.link[itemId];
          var node = view.node[itemId];

          if (link) {
            item = this.renderLink(itemId, link);
          }

          if (node) {
            item = this.renderNode(itemId, node);
          }
        }

        return _react2.default.createElement(
          'foreignObject',
          {
            onClick: function onClick() {
              // Remove focus from input.
              document.activeElement.blur();
            },
            onDoubleClick: _ignoreEvent2.default,
            onMouseDown: _ignoreEvent2.default,
            onMouseUp: _ignoreEvent2.default,
            width: width,
            x: x,
            y: y
          },
          item
        );
      }
    }, {
      key: 'renderLink',
      value: function renderLink(linkId, link) {
        var deleteLink = this.props.deleteLink;

        return _react2.default.createElement(
          'div',
          null,
          'link',
          _react2.default.createElement(
            'button',
            {
              onClick: function onClick() {
                deleteLink(linkId);
              }
            },
            'delete link'
          )
        );
      }
    }, {
      key: 'renderInsControls',
      value: function renderInsControls(nodeId, node) {
        var _props2 = this.props,
            createInputPin = _props2.createInputPin,
            deleteInputPin = _props2.deleteInputPin,
            view = _props2.view;


        var ins = node.ins || [];
        var lastInputPosition = ins.length - 1;
        var lastInputIsConnected = false;

        Object.keys(view.link).forEach(function (linkId) {
          var link = view.link[linkId];

          if (link.to && link.to[0] === nodeId && link.to[1] === lastInputPosition) {
            lastInputIsConnected = true;
          }
        });

        return _react2.default.createElement(
          'div',
          null,
          'ins',
          _react2.default.createElement(
            'button',
            {
              disabled: ins.length === 0 || lastInputIsConnected,
              onClick: function onClick() {
                deleteInputPin(nodeId);
              }
            },
            '-'
          ),
          _react2.default.createElement(
            'button',
            {
              onClick: function onClick() {
                createInputPin(nodeId);
              }
            },
            '+'
          )
        );
      }
    }, {
      key: 'renderOutsControls',
      value: function renderOutsControls(nodeId, node) {
        var _props3 = this.props,
            createOutputPin = _props3.createOutputPin,
            deleteOutputPin = _props3.deleteOutputPin,
            view = _props3.view;


        var outs = node.outs || [];
        var lastOutputPosition = outs.length - 1;
        var lastOutputIsConnected = false;

        Object.keys(view.link).forEach(function (linkId) {
          var link = view.link[linkId];

          if (link.from[0] === nodeId && link.from[1] === lastOutputPosition) {
            lastOutputIsConnected = true;
          }
        });

        return _react2.default.createElement(
          'div',
          null,
          'outs',
          _react2.default.createElement(
            'button',
            {
              disabled: outs.length === 0 || lastOutputIsConnected,
              onClick: function onClick() {
                deleteOutputPin(nodeId);
              }
            },
            '-'
          ),
          _react2.default.createElement(
            'button',
            {
              onClick: function onClick() {
                createOutputPin(nodeId);
              }
            },
            '+'
          )
        );
      }
    }, {
      key: 'renderNode',
      value: function renderNode(nodeId, node) {
        var _props4 = this.props,
            deleteNode = _props4.deleteNode,
            renameNode = _props4.renameNode;


        var setState = this.setState.bind(this);

        var newNodeText = this.state.newNodeText;

        var nodeText = newNodeText || node.text;

        var onChange = function onChange(e) {
          e.preventDefault();
          e.stopPropagation();

          var text = e.target.value;

          setState({ newNodeText: text });
        };

        var onKeyPress = function onKeyPress(e) {
          var text = nodeText.trim();

          var pressedEnter = e.key === 'Enter';
          var textIsNotBlank = text.length > 0;

          if (pressedEnter && textIsNotBlank) {
            setState({ newNodeText: null });

            renameNode(nodeId, text);
          }
        };

        var getFocus = function getFocus(e) {
          e.preventDefault();
          e.stopPropagation();

          e.target.focus();
        };

        return _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'label',
            {
              htmlFor: 'name'
            },
            'node'
          ),
          _react2.default.createElement('input', {
            type: 'text',
            onBlur: function onBlur() {
              var text = nodeText.trim();

              var textIsNotBlank = text.length > 0;

              if (textIsNotBlank) {
                renameNode(nodeId, text);
              }

              setState({ newNodeText: text });
            },
            onChange: onChange,
            onClick: getFocus,
            onKeyPress: onKeyPress,
            value: nodeText,
            style: { outline: 'none' }
          }),
          this.renderInsControls(nodeId, node),
          this.renderOutsControls(nodeId, node),
          _react2.default.createElement(
            'button',
            {
              onClick: function onClick() {
                deleteNode(nodeId);
              }
            },
            'delete node'
          )
        );
      }
    }]);

    return Inspector;
  }(_react.Component);

  Inspector.propTypes = {
    createInputPin: _react.PropTypes.func.isRequired,
    createOutputPin: _react.PropTypes.func.isRequired,
    deleteLink: _react.PropTypes.func.isRequired,
    deleteNode: _react.PropTypes.func.isRequired,
    deleteInputPin: _react.PropTypes.func.isRequired,
    deleteOutputPin: _react.PropTypes.func.isRequired,
    items: _react.PropTypes.array.isRequired,
    renameNode: _react.PropTypes.func.isRequired,
    view: _react.PropTypes.shape({
      link: _react.PropTypes.object.isRequired,
      node: _react.PropTypes.object.isRequired
    }).isRequired,
    width: _react.PropTypes.number.isRequired,
    x: _react.PropTypes.number.isRequired,
    y: _react.PropTypes.number.isRequired
  };

  Inspector.defaultProps = {
    createInputPin: Function.prototype,
    createOutputPin: Function.prototype,
    deleteLink: Function.prototype,
    deleteNode: Function.prototype,
    items: [],
    deleteInputPin: Function.prototype,
    deleteOutputPin: Function.prototype,
    renameNode: Function.prototype,
    width: 200,
    x: 0,
    y: 0
  };

  exports.default = Inspector;
  module.exports = exports['default'];
});