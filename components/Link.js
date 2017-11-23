'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _bindme = require('bindme');

var _bindme2 = _interopRequireDefault(_bindme);

var _theme = require('./theme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Link = function (_React$Component) {
  _inherits(Link, _React$Component);

  function Link() {
    var _this;

    _classCallCheck(this, Link);

    (0, _bindme2.default)((_this = _possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).call(this)), _this), 'onClick', 'onDoubleClick', 'onPathMouseDown', 'onSourceMouseDown', 'onTargetMouseDown');
    return _this;
  }

  _createClass(Link, [{
    key: 'onClick',
    value: function onClick(event) {
      event.stopPropagation();
    }
  }, {
    key: 'onDoubleClick',
    value: function onDoubleClick(event) {
      event.stopPropagation();
    }
  }, {
    key: 'onPathMouseDown',
    value: function onPathMouseDown(event) {
      event.preventDefault();
      event.stopPropagation();

      var _props = this.props,
          id = _props.id,
          deleteLink = _props.deleteLink,
          selected = _props.selected;


      if (selected) deleteLink(id);
    }
  }, {
    key: 'onSourceMouseDown',
    value: function onSourceMouseDown(event) {
      event.preventDefault();
      event.stopPropagation();

      var _props2 = this.props,
          from = _props2.from,
          createLink = _props2.createLink;


      createLink({ from: from });
    }
  }, {
    key: 'onTargetMouseDown',
    value: function onTargetMouseDown(event) {
      event.preventDefault();
      event.stopPropagation();

      var _props3 = this.props,
          id = _props3.id,
          startDraggingLinkTarget = _props3.startDraggingLinkTarget;


      startDraggingLinkTarget(id);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          selected = _props4.selected,
          selectLink = _props4.selectLink,
          sourceSelected = _props4.sourceSelected,
          targetSelected = _props4.targetSelected,
          theme = _props4.theme,
          to = _props4.to,
          x1 = _props4.x1,
          y1 = _props4.y1,
          x2 = _props4.x2,
          y2 = _props4.y2;


      var darkColor = theme.frame.color.dark;
      var primaryColor = theme.frame.color.primary;

      var baseColor = theme.link.color;
      var linkWidth = theme.link.width;
      var pinSize = theme.node.pin.size;

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
          onClick: this.onClick,
          onDoubleClick: this.onDoubleClick
        },
        _react2.default.createElement('path', {
          d: startY <= endY ? 'M ' + startX + ' ' + startY + ' C ' + controlPointX1 + ' ' + controlPointY1 + ', ' + controlPointX2 + ' ' + controlPointY2 + ' ,' + endX + ' ' + endY : 'M ' + startX + ' ' + startY + ' L ' + endX + ' ' + endY,
          fill: 'transparent',
          onMouseDown: this.onPathMouseDown,
          onMouseUp: selectLink,
          stroke: selected ? primaryColor : baseColor,
          strokeWidth: linkWidth
        }),
        _react2.default.createElement('rect', {
          fill: selected || sourceSelected ? darkColor : baseColor,
          height: pinSize,
          onMouseDown: this.onSourceMouseDown,
          width: pinSize,
          x: x1,
          y: y1
        }),
        to ? _react2.default.createElement('rect', {
          fill: selected || targetSelected ? darkColor : baseColor,
          height: pinSize,
          onMouseDown: this.onTargetMouseDown,
          width: pinSize,
          x: x2,
          y: y2
        }) : null
      );
    }
  }]);

  return Link;
}(_react2.default.Component);

Link.defaultProps = {
  createLink: Function.prototype,
  deleteLink: Function.prototype,
  startDraggingLinkTarget: Function.prototype,
  selected: false,
  selectLink: Function.prototype,
  sourceSelected: false,
  targetSelected: false,
  theme: _theme.defaultTheme
};
exports.default = Link;