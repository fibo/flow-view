(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', '../utils/ignoreEvent', '../utils/xOfPin', '../utils/computeNodeWidth', './theme'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('../utils/ignoreEvent'), require('../utils/xOfPin'), require('../utils/computeNodeWidth'), require('./theme'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.ignoreEvent, global.xOfPin, global.computeNodeWidth, global.theme);
    global.Node = mod.exports;
  }
})(this, function (module, exports, _react, _ignoreEvent, _xOfPin, _computeNodeWidth, _theme) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _ignoreEvent2 = _interopRequireDefault(_ignoreEvent);

  var _xOfPin2 = _interopRequireDefault(_xOfPin);

  var _computeNodeWidth2 = _interopRequireDefault(_computeNodeWidth);

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

  var Node = function (_Component) {
    _inherits(Node, _Component);

    function Node() {
      _classCallCheck(this, Node);

      return _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).apply(this, arguments));
    }

    _createClass(Node, [{
      key: 'getBody',
      value: function getBody() {
        var _props = this.props;
        var bodyHeight = _props.bodyHeight;
        var fontSize = _props.fontSize;
        var pinSize = _props.pinSize;
        var text = _props.text;


        // TODO place an id in the div wrapping the body and try to
        // resolve bodyHeight from its content.

        /*
         TODO The following code works and it is ok for custom nodes.
         BUT it os not ok for server side rendering cause foreignobject
           not supported in image context.
         return (
          <foreignObject
            height={bodyHeight}
            onClick={ignoreEvent}
            onDoubleClick={ignoreEvent}
            onMouseDown={willDragNode}
            onMouseUp={selectNode}
            transform={`translate(0,${pinSize})`}
            width={computedWidth}
          >
            <div
              style={{backgroundColor: color.body}}
            >
              <p
                style={{
                  marginLeft: pinSize,
                  marginRight: pinSize,
                  pointerEvents: 'none'
                }}
              >
                {text}
              </p>
            </div>
          </foreignObject>
        )
        */

        // Heuristic value, based on Courier font.
        var margin = fontSize * 0.2;

        return _react2.default.createElement(
          'text',
          {
            x: pinSize,
            y: bodyHeight + pinSize - margin
          },
          _react2.default.createElement(
            'tspan',
            null,
            text
          )
        );
      }
    }, {
      key: 'render',
      value: function render() {
        var _props2 = this.props;
        var bodyHeight = _props2.bodyHeight;
        var dragged = _props2.dragged;
        var draggedLinkId = _props2.draggedLinkId;
        var color = _props2.color;
        var fontSize = _props2.fontSize;
        var id = _props2.id;
        var ins = _props2.ins;
        var onCreateLink = _props2.onCreateLink;
        var outs = _props2.outs;
        var pinSize = _props2.pinSize;
        var selected = _props2.selected;
        var selectNode = _props2.selectNode;
        var text = _props2.text;
        var updateLink = _props2.updateLink;
        var width = _props2.width;
        var willDragNode = _props2.willDragNode;
        var x = _props2.x;
        var y = _props2.y;


        var bodyContent = this.getBody();

        var computedWidth = (0, _computeNodeWidth2.default)({
          bodyHeight: bodyHeight,
          pinSize: pinSize,
          fontSize: fontSize,
          node: { ins: ins, outs: outs, text: text, width: width }
        });

        return _react2.default.createElement(
          'g',
          {
            onClick: _ignoreEvent2.default,
            onDoubleClick: _ignoreEvent2.default,
            onMouseDown: willDragNode,
            onMouseUp: selectNode,
            style: {
              cursor: dragged ? 'pointer' : 'default'
            },
            transform: 'translate(' + x + ',' + y + ')'
          },
          _react2.default.createElement('rect', {
            fillOpacity: 0,
            height: bodyHeight + 2 * pinSize,
            stroke: selected || dragged ? color.selected : color.bar,
            strokeWidth: 1,
            width: computedWidth
          }),
          _react2.default.createElement('rect', {
            fill: selected || dragged ? color.selected : color.bar,
            height: pinSize,
            width: computedWidth
          }),
          ins.map(function (pin, i, array) {
            // TODO const name = (typeof pin === 'string' ? { name: pin } : pin)
            var x = (0, _xOfPin2.default)(pinSize, computedWidth, array.length, i);

            // TODO
            // const onMouseDown = (e) => {
            //   e.preventDefault()
            //   e.stopPropagation()
            //   onCreateLink({ from: null, to: [ id, i ] })
            // }

            var onMouseUp = function onMouseUp(e) {
              e.preventDefault();
              e.stopPropagation();

              if (draggedLinkId) {
                updateLink(draggedLinkId, { to: [id, i] });
              }
            };

            return _react2.default.createElement('rect', {
              key: i,
              fill: color.pin,
              height: pinSize,
              onMouseDown: _ignoreEvent2.default,
              onMouseUp: onMouseUp,
              transform: 'translate(' + x + ',0)',
              width: pinSize
            });
          }),
          bodyContent,
          _react2.default.createElement('rect', {
            fill: selected || dragged ? color.selected : color.bar,
            height: pinSize,
            transform: 'translate(0,' + (pinSize + bodyHeight) + ')',
            width: computedWidth
          }),
          outs.map(function (pin, i, array) {
            var x = (0, _xOfPin2.default)(pinSize, computedWidth, array.length, i);

            var onMouseDown = function onMouseDown(e) {
              e.preventDefault();
              e.stopPropagation();

              onCreateLink({ from: [id, i], to: null });
            };

            return _react2.default.createElement('rect', {
              key: i,
              fill: color.pin,
              height: pinSize,
              onClick: _ignoreEvent2.default,
              onMouseLeave: _ignoreEvent2.default,
              onMouseDown: onMouseDown,
              transform: 'translate(' + x + ',' + (pinSize + bodyHeight) + ')',
              width: pinSize
            });
          })
        );
      }
    }]);

    return Node;
  }(_react.Component);

  Node.propTypes = {
    bodyHeight: _react.PropTypes.number.isRequired,
    dragged: _react.PropTypes.bool.isRequired,
    draggedLinkId: _react.PropTypes.string,
    color: _react.PropTypes.shape({
      bar: _react.PropTypes.string.isRequired,
      body: _react.PropTypes.string.isRequired,
      pin: _react.PropTypes.string.isRequired
    }).isRequired,
    fontSize: _react.PropTypes.number.isRequired,
    id: _react.PropTypes.string,
    ins: _react.PropTypes.array.isRequired,
    outs: _react.PropTypes.array.isRequired,
    onCreateLink: _react.PropTypes.func.isRequired,
    pinSize: _react.PropTypes.number.isRequired,
    selected: _react.PropTypes.bool.isRequired,
    selectNode: _react.PropTypes.func.isRequired,
    text: _react.PropTypes.string.isRequired,
    updateLink: _react.PropTypes.func.isRequired,
    width: _react.PropTypes.number,
    willDragNode: _react.PropTypes.func.isRequired,
    x: _react.PropTypes.number.isRequired,
    y: _react.PropTypes.number.isRequired
  };

  Node.defaultProps = {
    bodyHeight: _theme2.default.nodeBodyHeight,
    dragged: false,
    color: {
      bar: 'lightgray',
      body: 'whitesmoke',
      border: 'gray',
      pin: 'darkgray', // Ahahah darkgray is not darker than gray
      selected: _theme2.default.highlightColor
      // Actually we have
      // whitesmoke < lightgray < darkgray < gray
    },
    draggedLinkId: null,
    ins: [],
    onCreateLink: Function.prototype,
    outs: [],
    pinSize: _theme2.default.pinSize,
    selected: false,
    selectNode: Function.prototype,
    text: 'Node',
    updateLink: Function.prototype,
    willDragNode: Function.prototype
  };

  exports.default = Node;
  module.exports = exports['default'];
});