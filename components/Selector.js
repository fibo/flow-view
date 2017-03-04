(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'inherits', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('inherits'), require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.inherits, global.react);
    global.Selector = mod.exports;
  }
})(this, function (module, exports, inherits, React) {
  'use strict';

  var Component = React.Component;
  var PropTypes = React.PropTypes;

  var hidden = { display: 'none', overflow: 'hidden' };
  var visible = { display: 'inline', overflow: 'visible' };

  function Selector() {
    Component.apply(this, arguments);

    this.state = { text: '' };
  }

  inherits(Selector, Component);

  function render() {
    var _this = this;

    var _props = this.props,
        createNode = _props.createNode,
        height = _props.height,
        nodeList = _props.nodeList,
        pointer = _props.pointer,
        show = _props.show,
        width = _props.width;


    var text = this.state.text;

    var onChange = function (e) {
      var text = e.target.value;

      _this.setState({ text: text });
    };

    var onKeyPress = function (e) {
      var text = e.target.value.trim();
      var pointer = _this.props.pointer;

      var pressedEnter = e.key === 'Enter';
      var textIsNotBlank = text.length > 0;

      if (pressedEnter) {
        if (textIsNotBlank) {
          createNode({
            ins: [],
            outs: [],
            text: text,
            x: pointer.x,
            y: pointer.y
          });
        }

        _this.setState({ text: '' });
      }
    };

    return React.createElement(
      'foreignObject',
      {
        height: height,
        style: show ? visible : hidden,
        width: width,
        x: pointer ? pointer.x : 0,
        y: pointer ? pointer.y : 0
      },
      React.createElement('input', {
        list: 'nodes',
        type: 'text',
        ref: function (input) {
          if (input !== null) input.focus();
        },
        style: { outline: 'none' },
        onChange: onChange,
        onKeyPress: onKeyPress,
        value: text
      }),
      nodeList ? React.createElement(
        'datalist',
        {
          id: 'nodes',
          onChange: onChange
        },
        nodeList.map(function (item, i) {
          return React.createElement('option', { key: i, value: item });
        })
      ) : null
    );
  }

  Selector.prototype.render = render;

  Selector.propTypes = {
    createNode: PropTypes.func.isRequired,
    nodelist: PropTypes.array,
    pointer: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    show: PropTypes.bool.isRequired
  };

  Selector.defaultProps = {
    height: 20,
    width: 200
  };

  module.exports = exports.default = Selector;
});