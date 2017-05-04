var inherits = require('inherits');
var no = require('not-defined');
var PropTypes = require('prop-types');
var React = require('react');
var ReactDOM = require('react-dom');

var Component = React.Component;

var computeNodeWidth = require('../utils/computeNodeWidth');
var ignoreEvent = require('../utils/ignoreEvent');
var xOfPin = require('../utils/xOfPin');

var DefaultLink = require('./Link');
var DefaultNode = require('./Node');
var Selector = require('./Selector');
var theme = require('./theme');

var isShift = code => code === 'ShiftLeft' || code === 'ShiftRight';

function Frame() {
  Component.apply(this, arguments);

  this.state = {
    dynamicView: { height: null, width: null },
    draggedLinkId: null,
    dragging: false,
    dragMoved: false,
    offset: { x: 0, y: 0 },
    pointer: null,
    scroll: { x: 0, y: 0 },
    showSelector: false,
    selectedItems: [],
    shiftPressed: false
  };
}

inherits(Frame, Component);

function componentDidMount() {
  var _props = this.props,
      createInputPin = _props.createInputPin,
      createOutputPin = _props.createOutputPin,
      deleteInputPin = _props.deleteInputPin,
      deleteOutputPin = _props.deleteOutputPin,
      dragItems = _props.dragItems,
      view = _props.view;


  var setState = this.setState.bind(this);

  var container = ReactDOM.findDOMNode(this).parentNode;

  document.addEventListener('keydown', event => {
    var code = event.code;

    var endDragging = this.props.endDragging;
    var _state = this.state,
        dragMoved = _state.dragMoved,
        selectedItems = _state.selectedItems,
        shiftPressed = _state.shiftPressed;


    if (isShift(code)) {
      setState({ shiftPressed: true });
    }

    if (code === 'Escape') {
      setState({ selectedItems: [] });
    }

    var selectedNodes = Object.keys(view.node).filter(id => selectedItems.indexOf(id) > -1);

    if (selectedNodes.length > 0 && code.substring(0, 5) === 'Arrow') {
      var draggingDelta = { x: 0, y: 0 };
      var unit = shiftPressed ? 1 : 10;

      if (code === 'ArrowLeft') draggingDelta.x = -unit;
      if (code === 'ArrowRight') draggingDelta.x = unit;
      if (code === 'ArrowUp') draggingDelta.y = -unit;
      if (code === 'ArrowDown') draggingDelta.y = unit;

      dragItems(draggingDelta, selectedNodes);

      if (!dragMoved) {
        setState({ dragMoved: true });
      }

      if (!shiftPressed) {
        endDragging(selectedNodes);

        setState({
          dragMoved: false,
          dragging: false
        });
      }
    }

    if (code === 'KeyI') {
      selectedItems.forEach(id => {
        if (view.node[id] && view.node[id].ins) {
          if (shiftPressed) {
            deleteInputPin(id);
          } else {
            createInputPin(id);
          }
        }
      });
    }

    if (code === 'KeyO') {
      selectedItems.forEach(id => {
        if (view.node[id] && view.node[id].outs) {
          if (shiftPressed) {
            deleteOutputPin(id);
          } else {
            createOutputPin(id);
          }
        }
      });
    }

    this.forceUpdate();
  });

  document.addEventListener('keyup', event => {
    var code = event.code;

    var endDragging = this.props.endDragging;
    var _state2 = this.state,
        dragMoved = _state2.dragMoved,
        selectedItems = _state2.selectedItems;


    var selectedNodes = Object.keys(view.node).filter(id => selectedItems.indexOf(id) > -1);

    if (isShift(code)) {
      setState({ shiftPressed: false });

      if (dragMoved && selectedNodes) {
        endDragging(selectedNodes);

        setState({
          dragging: false,
          dragMoved: false
        });
      }
    }
  });

  window.addEventListener('scroll', () => {
    setState({ scroll: {
        x: window.scrollX,
        y: window.scrollY
      } });
  });

  window.addEventListener('resize', () => {
    var rect = container.getBoundingClientRect();

    setState({ dynamicView: {
        height: rect.height,
        width: rect.width
      } });
  });

  var offset = {
    x: container.offsetLeft,
    y: container.offsetTop
  };

  var scroll = {
    x: window.scrollX,
    y: window.scrollY
  };

  setState({ offset: offset, scroll: scroll });
}

Frame.prototype.componentDidMount = componentDidMount;

function render() {
  var _props2 = this.props,
      createInputPin = _props2.createInputPin,
      createLink = _props2.createLink,
      createNode = _props2.createNode,
      createOutputPin = _props2.createOutputPin,
      deleteInputPin = _props2.deleteInputPin,
      deleteLink = _props2.deleteLink,
      deleteNode = _props2.deleteNode,
      deleteOutputPin = _props2.deleteOutputPin,
      dragItems = _props2.dragItems,
      endDragging = _props2.endDragging,
      fontSize = _props2.fontSize,
      item = _props2.item,
      model = _props2.model,
      selectLink = _props2.selectLink,
      selectNode = _props2.selectNode,
      theme = _props2.theme,
      updateLink = _props2.updateLink,
      view = _props2.view;
  var _state3 = this.state,
      draggedLinkId = _state3.draggedLinkId,
      pointer = _state3.pointer,
      dynamicView = _state3.dynamicView,
      selectedItems = _state3.selectedItems,
      showSelector = _state3.showSelector;
  var frameBorder = theme.frameBorder,
      fontFamily = theme.fontFamily,
      lineWidth = theme.lineWidth,
      nodeBodyHeight = theme.nodeBodyHeight,
      pinSize = theme.pinSize;


  var height = dynamicView.height || view.height;
  var width = dynamicView.width || view.width;

  var border = 1;
  height = height - 2 * border;
  width = width - 2 * border;

  var typeOfNode = item.util.typeOfNode;

  var Link = item.link.DefaultLink;

  var setState = this.setState.bind(this);

  var coordinatesOfLink = link => {
    var from = link.from;
    var to = link.to;

    var x1 = null;
    var y1 = null;
    var x2 = null;
    var y2 = null;

    var nodeIds = Object.keys(view.node);
    var idEquals = x => id => id === x[0];
    var sourceId = from ? nodeIds.find(idEquals(from)) : null;
    var targetId = to ? nodeIds.find(idEquals(to)) : null;

    var computedWidth = null;

    if (sourceId) {
      var source = view.node[sourceId];

      if (no(source.outs)) source.outs = {};

      computedWidth = computeNodeWidth({
        bodyHeight: nodeBodyHeight,
        pinSize: pinSize,
        fontSize: fontSize,
        node: source
      });

      x1 = source.x + xOfPin(pinSize, computedWidth, source.outs.length, from[1]);
      y1 = source.y + pinSize + nodeBodyHeight;
    }

    if (targetId) {
      var target = view.node[targetId];

      if (no(target.ins)) target.ins = {};

      computedWidth = computeNodeWidth({
        bodyHeight: nodeBodyHeight,
        pinSize: pinSize,
        fontSize: fontSize,
        node: target
      });

      x2 = target.x + xOfPin(pinSize, computedWidth, target.ins.length, to[1]);
      y2 = target.y;
    } else {
      x2 = pointer ? pointer.x - pinSize / 2 : x1;
      y2 = pointer ? pointer.y - pinSize : y1;
    }

    return { x1: x1, y1: y1, x2: x2, y2: y2 };
  };

  var getCoordinates = e => {
    var _state4 = this.state,
        offset = _state4.offset,
        scroll = _state4.scroll;


    return {
      x: e.clientX - offset.x + scroll.x,
      y: e.clientY - offset.y + scroll.y
    };
  };

  var onClick = e => {
    e.preventDefault();
    e.stopPropagation();

    setState({ showSelector: false });
  };

  var onCreateLink = link => {
    var draggedLinkId = createLink(link);

    setState({ draggedLinkId: draggedLinkId });
  };

  var onUpdateLink = (id, link) => {
    updateLink(id, link);

    var disconnectingLink = link.to === null;

    if (disconnectingLink) {
      link.id = id;

      setState({ draggedLinkId: id });
    } else {
      setState({ draggedLinkId: null });
    }
  };

  var onDoubleClick = e => {
    e.preventDefault();
    e.stopPropagation();

    setState({
      pointer: getCoordinates(e),
      showSelector: true
    });
  };

  var onMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();

    setState({
      selectedItems: []
    });
  };

  var onMouseLeave = e => {
    e.preventDefault();
    e.stopPropagation();

    var draggedLinkId = this.state.draggedLinkId;
    if (draggedLinkId) delete view.link[draggedLinkId];

    setState({
      dragging: false,
      draggedLinkId: null,
      pointer: null,
      showSelector: false
    });
  };

  var onMouseMove = e => {
    e.preventDefault();
    e.stopPropagation();

    var _state5 = this.state,
        dragging = _state5.dragging,
        dragMoved = _state5.dragMoved,
        selectedItems = _state5.selectedItems;


    var nextPointer = getCoordinates(e);

    setState({
      pointer: nextPointer
    });

    if (dragging && selectedItems.length > 0) {
      var draggingDelta = {
        x: pointer ? nextPointer.x - pointer.x : 0,
        y: pointer ? nextPointer.y - pointer.y : 0
      };

      dragItems(draggingDelta, selectedItems);

      if (!dragMoved) {
        setState({ dragMoved: true });
      }
    }
  };

  var onMouseUp = e => {
    e.preventDefault();
    e.stopPropagation();

    var _state6 = this.state,
        draggedLinkId = _state6.draggedLinkId,
        dragMoved = _state6.dragMoved,
        selectedItems = _state6.selectedItems;


    if (draggedLinkId) {
      delete view.link[draggedLinkId];

      setState({
        draggedLinkId: null,
        pointer: null
      });
    } else {
      var selectedNodes = Object.keys(view.node).filter(id => selectedItems.indexOf(id) > -1);

      if (dragMoved) {
        endDragging(selectedNodes);

        setState({
          dragging: false,
          dragMoved: false,
          pointer: null
        });
      } else {
        setState({
          pointer: null
        });
      }
    }
  };

  var selectedFirst = (a, b) => {
    var aIsSelected = selectedItems.indexOf(a) > -1;
    var bIsSelected = selectedItems.indexOf(b) > -1;

    if (aIsSelected && bIsSelected) return 0;

    if (aIsSelected) return 1;
    if (bIsSelected) return -1;
  };

  var selectItem = id => e => {
    e.preventDefault();
    e.stopPropagation();

    var _state7 = this.state,
        draggedLinkId = _state7.draggedLinkId,
        shiftPressed = _state7.shiftPressed;


    if (draggedLinkId) {
      delete view.link[draggedLinkId];

      setState({ draggedLinkId: null });

      return;
    }

    var selectedItems = this.state.selectedItems.slice(0);

    var index = selectedItems.indexOf(id);

    var itemAlreadySelected = index > -1;

    if (shiftPressed) {
      if (itemAlreadySelected) {
        selectedItems.splice(index, 1);
      } else {
        selectedItems.push(id);
      }
    } else {
      if (!itemAlreadySelected) {
        selectedItems = [id];
      }
    }

    if (!itemAlreadySelected) {
      if (Object.keys(view.node).indexOf(id) > -1) {
        selectNode(id);
      }

      if (Object.keys(view.link).indexOf(id) > -1) {
        selectLink(id);
      }
    }

    setState({
      dragging: true,
      selectedItems: selectedItems
    });
  };

  var startDraggingLinkTarget = id => {
    var from = view.link[id].from;

    deleteLink(id);

    var draggedLinkId = createLink({ from: from });
    setState({ draggedLinkId: draggedLinkId });
  };

  return React.createElement(
    'svg',
    {
      fontFamily: fontFamily,
      fontSize: fontSize,
      height: height,
      onClick: onClick,
      onDoubleClick: onDoubleClick,
      onMouseDown: onMouseDown,
      onMouseEnter: ignoreEvent,
      onMouseLeave: onMouseLeave,
      onMouseMove: onMouseMove,
      onMouseUp: onMouseUp,
      textAnchor: 'start',
      style: { border: frameBorder },
      width: width
    },
    Object.keys(view.node).sort(selectedFirst).map((id, i) => {
      var node = view.node[id];

      var height = node.height,
          ins = node.ins,
          outs = node.outs,
          text = node.text,
          width = node.width,
          x = node.x,
          y = node.y;


      var nodeType = typeOfNode(node);
      var Node = item.node[nodeType];

      return React.createElement(Node, { key: i,
        createInputPin: createInputPin,
        createOutputPin: createOutputPin,
        draggedLinkId: draggedLinkId,
        deleteInputPin: deleteInputPin,
        deleteNode: deleteNode,
        deleteOutputPin: deleteOutputPin,
        fontSize: fontSize,
        height: height,
        id: id,
        ins: ins,
        model: model,
        multiSelection: selectedItems.length > 1,
        onCreateLink: onCreateLink,
        outs: outs,
        pinSize: pinSize,
        selected: selectedItems.indexOf(id) > -1,
        selectNode: selectItem(id),
        text: text,
        updateLink: onUpdateLink,
        width: width,
        x: x,
        y: y
      });
    }),
    Object.keys(view.link).map((id, i) => {
      var _view$link$id = view.link[id],
          from = _view$link$id.from,
          to = _view$link$id.to;


      var coord = coordinatesOfLink(view.link[id]);
      var sourceSelected = from ? selectedItems.indexOf(from[0]) > -1 : false;
      var targetSelected = to ? selectedItems.indexOf(to[0]) > -1 : false;

      return React.createElement(Link, { key: i,
        deleteLink: deleteLink,
        from: from,
        lineWidth: lineWidth,
        id: id,
        onCreateLink: onCreateLink,
        startDraggingLinkTarget: startDraggingLinkTarget,
        pinSize: pinSize,
        selected: selectedItems.indexOf(id) > -1,
        selectLink: selectItem(id),
        sourceSelected: sourceSelected,
        targetSelected: targetSelected,
        to: to,
        x1: coord.x1,
        y1: coord.y1,
        x2: coord.x2,
        y2: coord.y2
      });
    }),
    React.createElement(Selector, {
      createNode: node => {
        var id = createNode(node);

        setState({
          selectedItems: [id],
          showSelector: false
        });
      },
      nodeList: item.nodeList,
      pointer: pointer,
      show: showSelector
    })
  );
}

Frame.prototype.render = render;

Frame.propTypes = {
  createInputPin: PropTypes.func.isRequired,
  createOutputPin: PropTypes.func.isRequired,
  createLink: PropTypes.func.isRequired,
  createNode: PropTypes.func.isRequired,
  deleteLink: PropTypes.func.isRequired,
  deleteInputPin: PropTypes.func.isRequired,
  deleteNode: PropTypes.func.isRequired,
  deleteOutputPin: PropTypes.func.isRequired,
  dragItems: PropTypes.func.isRequired,
  endDragging: PropTypes.func.isRequired,
  fontSize: PropTypes.number.isRequired,
  item: PropTypes.shape({
    link: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    nodeList: PropTypes.array.isRequired,
    util: PropTypes.shape({
      typeOfNode: PropTypes.func.isRequired
    })
  }).isRequired,
  selectLink: PropTypes.func.isRequired,
  selectNode: PropTypes.func.isRequired,
  theme: theme.propTypes,
  updateLink: PropTypes.func.isRequired,
  view: PropTypes.shape({
    height: PropTypes.number.isRequired,
    link: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired
  }).isRequired
};

Frame.defaultProps = {
  createLink: Function.prototype,
  createNode: Function.prototype,
  createInputPin: Function.prototype,
  createOutputPin: Function.prototype,
  deleteInputPin: Function.prototype,
  deleteLink: Function.prototype,
  deleteNode: Function.prototype,
  deleteOutputPin: Function.prototype,
  dragItems: Function.prototype,
  endDragging: Function.prototype,
  fontSize: 17,
  item: {
    link: { DefaultLink: DefaultLink },
    node: { DefaultNode: DefaultNode },
    nodeList: [],
    util: {
      typeOfNode: function (node) {
        return 'DefaultNode';
      }
    }
  },
  theme: theme.defaultProps,
  selectLink: Function.prototype,
  selectNode: Function.prototype,
  updateLink: Function.prototype,
  view: {
    link: {},
    node: {}
  }
};

module.exports = exports.default = Frame;