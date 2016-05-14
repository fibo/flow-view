'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * Create new nodes.
 *
 * Datalist feature stolen from article: http://blog.teamtreehouse.com/creating-autocomplete-dropdowns-datalist-element
 * and this codepen: http://codepen.io/matt-west/pen/jKnzG
 *
 * @param {Object} canvas
 * @param {Object} arg
 * @param {String} dataListUrl containing datalist entries
 */

function NodeSelector(canvas, arg) {
  var x = this.x = 0,
      y = this.y = 0;

  if (typeof arg === 'undefined') arg = {};

  var foreignObject = canvas.svg.foreignObject(100, 100).attr({ id: 'flow-view-selector' });

  foreignObject.appendChild('form', {
    id: 'flow-view-selector-form',
    name: 'nodeselector'
  });

  var form = foreignObject.getChild(0);

  var selectorInput = document.createElement('input');

  selectorInput.id = 'flow-view-selector-input';
  selectorInput.name = 'selectnode';
  selectorInput.type = 'text';

  var dataList = null,
      dataListItems = null,
      dataListURL = null;

  if (_typeof(arg.dataList) === 'object') {
    dataListItems = arg.dataList.items;
    dataListURL = arg.dataList.URL;
    dataList = document.createElement('datalist');

    dataList.id = 'flow-view-selector-list';

    selectorInput.setAttribute('list', dataList.id);
    selectorInput.appendChild(dataList);
  }

  function addToDataList(item) {
    var option = document.createElement('option');

    option.value = item;

    dataList.appendChild(option);
  }

  if (typeof dataListURL === 'string') {
    var request = new XMLHttpRequest();

    selectorInput.placeholder = 'Loading ...';

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          var jsonOptions = JSON.parse(request.responseText);

          jsonOptions.forEach(addToDataList);

          selectorInput.placeholder = '';
        } else {
          // On error, notify in placeholder.
          input.placeholder = 'Could not load datalist :(';
        }
      }
    };

    request.open('GET', dataListURL, true);
    request.send();
  }

  form.appendChild(selectorInput);

  function createNode() {
    foreignObject.hide();

    var inputText = document.getElementById('flow-view-selector-input');

    var nodeName = inputText.value;

    var nodeView = {
      text: nodeName,
      x: this.x,
      y: this.y
    };

    canvas.broker.emit('addNode', nodeView);

    // Remove input text, so next time node selector is shown empty again.
    inputText.value = '';

    // It is required to return false to have a form with no action.
    return false;
  }

  form.onsubmit = createNode.bind(this);

  // Start hidden.
  foreignObject.attr({ width: 200, height: 100 }).move(x, y).hide();

  foreignObject.on('click', function (ev) {
    ev.stopPropagation();
  });

  this.foreignObject = foreignObject;
}

function hide(ev) {
  this.foreignObject.hide();
}

NodeSelector.prototype.hide = hide;

function show(ev) {
  var x = ev.offsetX,
      y = ev.offsetY;

  var foreignObject = this.foreignObject;

  this.x = x;
  this.y = y;

  foreignObject.move(x, y).show();

  var form = foreignObject.getChild(0);
  form.selectnode.focus();
}

NodeSelector.prototype.show = show;

module.exports = NodeSelector;