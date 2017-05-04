var inherits = require('inherits');
var PropTypes = require('prop-types');
var React = require('react');

var Component = React.Component;

var hidden = { display: 'none', overflow: 'hidden' };
var visible = { display: 'inline', overflow: 'visible' };

function Selector() {
  Component.apply(this, arguments);

  this.state = { text: '' };
}

inherits(Selector, Component);

function render() {
  var _props = this.props,
      createNode = _props.createNode,
      height = _props.height,
      nodeList = _props.nodeList,
      pointer = _props.pointer,
      show = _props.show,
      width = _props.width;


  var text = this.state.text;

  var onChange = e => {
    var text = e.target.value;

    this.setState({ text: text });
  };

  var onKeyPress = e => {
    var text = e.target.value.trim();
    var pointer = this.props.pointer;

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

      this.setState({ text: '' });
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
      ref: input => {
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
      nodeList.map((item, i) => React.createElement('option', { key: i, value: item }))
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