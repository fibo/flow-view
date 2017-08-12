'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Link = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _bindme = require('bindme');

var _bindme2 = _interopRequireDefault(_bindme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropTypes = require('prop-types');

var ignoreEvent = require('../utils/ignoreEvent');
var theme = require('./theme');

var Link = exports.Link = function (_React$Component) {
  _inherits(Link, _React$Component);

  function Link(props) {
    _classCallCheck(this, Link);

    var _this = _possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).call(this, props));

    (0, _bindme2.default)(_this, 'onSourceMouseDown');
    return _this;
  }

  _createClass(Link, [{
    key: 'onSourceMouseDown',
    value: function onSourceMouseDown(event) {
      event.preventDefault();
      event.stopPropagation();

      this.props.onCreateLink({ from: from, to: null });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          id = _props.id,
          deleteLink = _props.deleteLink,
          from = _props.from,
          onCreateLink = _props.onCreateLink,
          startDraggingLinkTarget = _props.startDraggingLinkTarget,
          selected = _props.selected,
          selectLink = _props.selectLink,
          sourceSelected = _props.sourceSelected,
          targetSelected = _props.targetSelected,
          theme = _props.theme,
          to = _props.to,
          x1 = _props.x1,
          y1 = _props.y1,
          x2 = _props.x2,
          y2 = _props.y2;
      var darkPrimaryColor = theme.darkPrimaryColor,
          primaryColor = theme.primaryColor,
          linkColor = theme.linkColor,
          lineWidth = theme.lineWidth,
          pinSize = theme.pinSize;


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

      var controlPointX1 = startX;
      var controlPointY1 = to ? midPointY : startY;
      var controlPointX2 = endX;
      var controlPointY2 = to ? midPointY : endY;

      return _react2.default.createElement(
        'g',
        {
          onClick: ignoreEvent,
          onDoubleClick: ignoreEvent
        },
        _react2.default.createElement('path', {
          d: 'M ' + startX + ' ' + startY + ' C ' + controlPointX1 + ' ' + controlPointY1 + ', ' + controlPointX2 + ' ' + controlPointY2 + ' ,' + endX + ' ' + endY,
          fill: 'transparent',
          onMouseDown: function onMouseDown() {
            if (selected) deleteLink(id);
          },
          onMouseUp: selectLink,
          stroke: selected ? primaryColor : linkColor,
          strokeWidth: lineWidth
        }),
        _react2.default.createElement('rect', {
          fill: selected || sourceSelected ? darkPrimaryColor : linkColor,
          height: pinSize,
          onMouseDown: this.onSourceMouseDown,
          width: pinSize,
          x: x1,
          y: y1
        }),
        to ? _react2.default.createElement('rect', {
          fill: selected || targetSelected ? darkPrimaryColor : linkColor,
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
}(_react2.default.Component);

Link.propTypes = {
  deleteLink: PropTypes.func.isRequired,
  id: PropTypes.string,
  from: PropTypes.array,
  onCreateLink: PropTypes.func.isRequired,
  startDraggingLinkTarget: PropTypes.func.isRequired,
  pinSize: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  selectLink: PropTypes.func.isRequired,
  sourceSelected: PropTypes.bool.isRequired,
  targetSelected: PropTypes.bool.isRequired,
  theme: theme.propTypes,
  to: PropTypes.array,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired
};

Link.defaultProps = {
  deleteLink: Function.prototype,
  onCreateLink: Function.prototype,
  startDraggingLinkTarget: Function.prototype,
  selected: false,
  selectLink: Function.prototype,
  sourceSelected: false,
  targetSelected: false,
  theme: theme.defaultProps
};

module.exports = exports.default = Link;