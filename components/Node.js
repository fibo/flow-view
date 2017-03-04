(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'inherits', 'react', 'not-defined', '../utils/computeNodeWidth', '../utils/ignoreEvent', '../utils/xOfPin', './theme'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('inherits'), require('react'), require('not-defined'), require('../utils/computeNodeWidth'), require('../utils/ignoreEvent'), require('../utils/xOfPin'), require('./theme'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.inherits, global.react, global.notDefined, global.computeNodeWidth, global.ignoreEvent, global.xOfPin, global.theme);
    global.Node = mod.exports;
  }
})(this, function (module, exports, inherits, React, no, computeNodeWidth, ignoreEvent, xOfPin, theme) {
  'use strict';

  var Component = React.Component;
  var PropTypes = React.PropTypes;

  var minus = function (pinSize) {
    return 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' Z';
  };

  var plus = function (pinSize) {
    return 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize / 3 + ' V ' + pinSize + ' H ' + 2 * pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' H ' + 2 * pinSize / 3 + ' V ' + 0 + ' H ' + pinSize / 3 + ' V ' + pinSize / 3 + ' Z';
  };

  function Node() {
    Component.apply(this, arguments);
  }

  inherits(Node, Component);

  function getBody() {
    var _props = this.props,
        fontSize = _props.fontSize,
        theme = _props.theme,
        text = _props.text;
    var pinSize = theme.pinSize;


    var bodyHeight = this.getBodyHeight();

    // Heuristic value, based on Courier font.
    var margin = fontSize * 0.2;

    return React.createElement(
      'text',
      {
        x: pinSize,
        y: bodyHeight + pinSize - margin
      },
      React.createElement(
        'tspan',
        null,
        text
      )
    );
  }

  Node.prototype.getBody = getBody;

  function getBodyHeight() {
    var _props2 = this.props,
        bodyHeight = _props2.bodyHeight,
        theme = _props2.theme;


    return bodyHeight || theme.nodeBodyHeight;
  }

  Node.prototype.getBodyHeight = getBodyHeight;

  function getComputedWidth() {
    var _props3 = this.props,
        fontSize = _props3.fontSize,
        ins = _props3.ins,
        outs = _props3.outs,
        text = _props3.text,
        theme = _props3.theme,
        width = _props3.width;
    var pinSize = theme.pinSize;


    var bodyHeight = this.getBodyHeight();

    var computedWidth = computeNodeWidth({
      bodyHeight: bodyHeight,
      pinSize: pinSize,
      fontSize: fontSize,
      node: { ins: ins, outs: outs, text: text, width: width }
    });

    return computedWidth;
  }

  Node.prototype.getComputedWidth = getComputedWidth;

  function getDeleteButton() {
    var _props4 = this.props,
        deleteNode = _props4.deleteNode,
        id = _props4.id,
        multiSelection = _props4.multiSelection,
        selected = _props4.selected,
        theme = _props4.theme;
    var primaryColor = theme.primaryColor,
        pinSize = theme.pinSize;


    if (selected === false || multiSelection) return null;

    return React.createElement('path', {
      d: 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize / 3 + ' V ' + pinSize + ' H ' + 2 * pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' H ' + 2 * pinSize / 3 + ' V ' + 0 + ' H ' + pinSize / 3 + ' V ' + pinSize / 3 + ' Z',
      fill: primaryColor,
      transform: 'translate(' + pinSize / 2 + ',' + pinSize / 2 + ') rotate(45) translate(' + -3 * pinSize / 2 + ',' + pinSize / 2 + ')',
      onMouseDown: function () {
        return deleteNode(id);
      }
    });
  }

  Node.prototype.getDeleteButton = getDeleteButton;

  function getInputMinus() {
    var _props5 = this.props,
        deleteInputPin = _props5.deleteInputPin,
        id = _props5.id,
        ins = _props5.ins,
        multiSelection = _props5.multiSelection,
        selected = _props5.selected,
        theme = _props5.theme;
    var primaryColor = theme.primaryColor,
        pinSize = theme.pinSize;


    if (no(ins) || selected === false || multiSelection) return null;

    var computedWidth = this.getComputedWidth();
    var disabled = ins.length === 0;

    return React.createElement('path', {
      d: minus(pinSize),
      fill: disabled ? 'transparent' : primaryColor,
      onMouseDown: function () {
        if (!disabled) deleteInputPin(id);
      },
      stroke: primaryColor,
      transform: 'translate(' + (computedWidth + 2) + ',0)'
    });
  }

  Node.prototype.getInputMinus = getInputMinus;

  function getInputPlus() {
    var _props6 = this.props,
        createInputPin = _props6.createInputPin,
        id = _props6.id,
        ins = _props6.ins,
        multiSelection = _props6.multiSelection,
        selected = _props6.selected,
        theme = _props6.theme;
    var primaryColor = theme.primaryColor,
        pinSize = theme.pinSize;


    if (no(ins) || selected === false || multiSelection) return null;

    var computedWidth = this.getComputedWidth();

    return React.createElement('path', {
      d: plus(pinSize),
      fill: primaryColor,
      onMouseDown: function () {
        return createInputPin(id);
      },
      stroke: primaryColor,
      transform: 'translate(' + (computedWidth + 4 + pinSize) + ',0)'
    });
  }

  Node.prototype.getInputPlus = getInputPlus;

  function getOutputMinus() {
    var _props7 = this.props,
        deleteOutputPin = _props7.deleteOutputPin,
        id = _props7.id,
        multiSelection = _props7.multiSelection,
        outs = _props7.outs,
        selected = _props7.selected,
        theme = _props7.theme;
    var primaryColor = theme.primaryColor,
        pinSize = theme.pinSize;


    if (no(outs) || selected === false || multiSelection) return null;

    var bodyHeight = this.getBodyHeight();
    var computedWidth = this.getComputedWidth();
    var disabled = outs.length === 0;

    return React.createElement('path', {
      d: minus(pinSize),
      fill: disabled ? 'transparent' : primaryColor,
      onMouseDown: function () {
        if (!disabled) deleteOutputPin(id);
      },
      stroke: primaryColor,
      transform: 'translate(' + (computedWidth + 2) + ',' + (bodyHeight + pinSize) + ')'
    });
  }

  Node.prototype.getOutputMinus = getOutputMinus;

  function getOutputPlus() {
    var _props8 = this.props,
        createOutputPin = _props8.createOutputPin,
        id = _props8.id,
        multiSelection = _props8.multiSelection,
        outs = _props8.outs,
        selected = _props8.selected,
        theme = _props8.theme;
    var primaryColor = theme.primaryColor,
        pinSize = theme.pinSize;


    if (no(outs) || selected === false || multiSelection) return null;

    var bodyHeight = this.getBodyHeight();
    var computedWidth = this.getComputedWidth();

    return React.createElement('path', {
      d: plus(pinSize),
      fill: primaryColor,
      onMouseDown: function () {
        return createOutputPin(id);
      },
      stroke: primaryColor,
      transform: 'translate(' + (computedWidth + 4 + pinSize) + ',' + (bodyHeight + pinSize) + ')'
    });
  }

  Node.prototype.getOutputPlus = getOutputPlus;

  function render() {
    var _props9 = this.props,
        dragging = _props9.dragging,
        draggedLinkId = _props9.draggedLinkId,
        id = _props9.id,
        ins = _props9.ins,
        onCreateLink = _props9.onCreateLink,
        outs = _props9.outs,
        selected = _props9.selected,
        selectNode = _props9.selectNode,
        theme = _props9.theme,
        updateLink = _props9.updateLink,
        x = _props9.x,
        y = _props9.y;
    var darkPrimaryColor = theme.darkPrimaryColor,
        nodeBarColor = theme.nodeBarColor,
        pinColor = theme.pinColor,
        pinSize = theme.pinSize,
        primaryColor = theme.primaryColor;


    var bodyContent = this.getBody();
    var bodyHeight = this.getBodyHeight();
    var computedWidth = this.getComputedWidth();

    return React.createElement(
      'g',
      {
        onDoubleClick: ignoreEvent,
        onMouseDown: selectNode,
        style: {
          cursor: dragging ? 'pointer' : 'default'
        },
        transform: 'translate(' + x + ',' + y + ')'
      },
      this.getDeleteButton(),
      this.getInputMinus(),
      this.getInputPlus(),
      this.getOutputMinus(),
      this.getOutputPlus(),
      React.createElement('rect', {
        fillOpacity: 0,
        height: bodyHeight + 2 * pinSize,
        stroke: selected ? primaryColor : nodeBarColor,
        strokeWidth: 1,
        width: computedWidth
      }),
      React.createElement('rect', {
        fill: selected ? primaryColor : nodeBarColor,
        height: pinSize,
        width: computedWidth
      }),
      ins && ins.map(function (pin, i, array) {
        var x = xOfPin(pinSize, computedWidth, array.length, i);

        var onMouseUp = function (e) {
          e.preventDefault();
          e.stopPropagation();

          if (draggedLinkId) {
            updateLink(draggedLinkId, { to: [id, i] });
          }
        };

        return React.createElement('rect', {
          key: i,
          fill: selected ? darkPrimaryColor : pinColor,
          height: pinSize,
          onMouseDown: ignoreEvent,
          onMouseUp: onMouseUp,
          transform: 'translate(' + x + ',0)',
          width: pinSize
        });
      }),
      bodyContent,
      React.createElement('rect', {
        fill: selected ? primaryColor : nodeBarColor,
        height: pinSize,
        transform: 'translate(0,' + (pinSize + bodyHeight) + ')',
        width: computedWidth
      }),
      outs && outs.map(function (pin, i, array) {
        var x = xOfPin(pinSize, computedWidth, array.length, i);

        var onMouseDown = function (e) {
          e.preventDefault();
          e.stopPropagation();

          onCreateLink({ from: [id, i], to: null });
        };

        return React.createElement('rect', {
          key: i,
          fill: selected ? darkPrimaryColor : pinColor,
          height: pinSize,
          onClick: ignoreEvent,
          onMouseLeave: ignoreEvent,
          onMouseDown: onMouseDown,
          transform: 'translate(' + x + ',' + (pinSize + bodyHeight) + ')',
          width: pinSize
        });
      })
    );
  }

  Node.prototype.render = render;

  Node.propTypes = {
    bodyHeight: PropTypes.number,
    createInputPin: PropTypes.func.isRequired,
    createOutputPin: PropTypes.func.isRequired,
    deleteInputPin: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired,
    deleteOutputPin: PropTypes.func.isRequired,
    dragging: PropTypes.bool.isRequired,
    draggedLinkId: PropTypes.string,
    fontSize: PropTypes.number.isRequired,
    id: PropTypes.string,
    ins: PropTypes.array,
    multiSelection: PropTypes.bool.isRequired,
    outs: PropTypes.array,
    onCreateLink: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    selectNode: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    theme: theme.propTypes,
    updateLink: PropTypes.func.isRequired,
    width: PropTypes.number,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  };

  Node.defaultProps = {
    createInputPin: Function.prototype,
    createOutputPin: Function.prototype,
    deleteInputPin: Function.prototype,
    deleteNode: Function.prototype,
    deleteOutputPin: Function.prototype,
    dragging: false,
    draggedLinkId: null,
    multiSelection: false,
    onCreateLink: Function.prototype,
    selected: false,
    selectNode: Function.prototype,
    text: 'Node',
    theme: theme.defaultProps,
    updateLink: Function.prototype
  };

  module.exports = exports.default = Node;
});