(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', '../../util/ignoreEvent', './NumIns', './NumOuts'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('../../util/ignoreEvent'), require('./NumIns'), require('./NumOuts'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.ignoreEvent, global.NumIns, global.NumOuts);
    global.index = mod.exports;
  }
})(this, function (module, exports, _react, _ignoreEvent, _NumIns, _NumOuts) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _ignoreEvent2 = _interopRequireDefault(_ignoreEvent);

  var _NumIns2 = _interopRequireDefault(_NumIns);

  var _NumOuts2 = _interopRequireDefault(_NumOuts);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var fill = 'ghostwhite';
  var styles = {
    defaultBox: { stroke: 'black', strokeWidth: 1 },
    defaultPin: { stroke: 'black', strokeWidth: 1 }
  };

  var Node = function Node(_ref) {
    var id = _ref.id;
    var x = _ref.x;
    var y = _ref.y;
    var width = _ref.width;
    var height = _ref.height;
    var text = _ref.text;
    var pinRadius = _ref.pinRadius;
    var ins = _ref.ins;
    var outs = _ref.outs;
    var offset = _ref.offset;
    var addLink = _ref.addLink;
    var selectNode = _ref.selectNode;
    var delNode = _ref.delNode;
    var selected = _ref.selected;
    var setNumIns = _ref.setNumIns;
    var setNumOuts = _ref.setNumOuts;
    return _react2.default.createElement(
      'g',
      {
        onClick: _ignoreEvent2.default,
        onDoubleClick: _ignoreEvent2.default,
        onMouseDown: selectNode,
        transform: 'translate(' + x + ',' + y + ')',
        style: {
          cursor: selected ? 'pointer' : 'default'
        }
      },
      selected ? _react2.default.createElement(
        'g',
        {
          onClick: delNode
        },
        _react2.default.createElement('rect', {
          transform: 'translate(' + (width + 2) + ',-18)',
          rx: pinRadius,
          ry: pinRadius,
          width: 20,
          height: 20,
          fill: fill,
          style: styles.defaultBox
        }),
        _react2.default.createElement('path', {
          transform: 'translate(' + width + ',-20)',
          fill: 'black',
          d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
        })
      ) : undefined,
      selected ? _react2.default.createElement(_NumIns2.default, { setNum: setNumIns, value: ins.length }) : undefined,
      selected ? _react2.default.createElement(_NumOuts2.default, { setNum: setNumOuts, value: outs.length }) : undefined,
      _react2.default.createElement('rect', {
        rx: pinRadius,
        ry: pinRadius,
        width: width,
        height: height,
        fill: fill,
        style: styles.defaultBox
      }),
      _react2.default.createElement(
        'text',
        {
          x: pinRadius * 2,
          y: height / 2,
          style: { pointerEvents: 'none' }
        },
        _react2.default.createElement(
          'tspan',
          null,
          text
        )
      ),
      ins.map(function (pin, i, array) {
        return _react2.default.createElement('circle', {
          key: i,
          cx: pin.cx,
          cy: pin.cy,
          r: pin.r,
          fill: fill,
          onClick: _ignoreEvent2.default,
          onMouseLeave: _ignoreEvent2.default,
          onMouseDown: _ignoreEvent2.default,
          style: styles.defaultPin
        });
      }),
      outs.map(function (pin, i) {
        return _react2.default.createElement('circle', {
          key: i,
          cx: pin.cx,
          cy: pin.cy,
          r: pin.r,
          fill: fill,
          style: styles.defaultPin,
          onClick: _ignoreEvent2.default,
          onMouseDown: function onMouseDown(e) {
            e.preventDefault();
            e.stopPropagation();

            var previousDraggingPoint = {
              x: e.clientX - offset.x,
              y: e.clientY - offset.y
            };

            var from = [id, i];
            var to = null;

            addLink({ from: from, to: to }, previousDraggingPoint);
          },
          onMouseUp: _ignoreEvent2.default,
          onMouseLeave: _ignoreEvent2.default
        });
      })
    );
  };

  Node.propTypes = {
    x: _react.PropTypes.number.isRequired,
    y: _react.PropTypes.number.isRequired,
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired,
    pinRadius: _react.PropTypes.number.isRequired,
    text: _react.PropTypes.string.isRequired,
    ins: _react.PropTypes.array.isRequired,
    outs: _react.PropTypes.array.isRequired,
    selectNode: _react.PropTypes.func.isRequired,
    selected: _react.PropTypes.bool.isRequired
  };

  Node.defaultProps = {
    selected: false
  };

  exports.default = Node;
  module.exports = exports['default'];
});