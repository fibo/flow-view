'use strict';

var AddInputButton = require('./NodeButton/AddInput'),
    AddOutputButton = require('./NodeButton/AddOutput'),
    DeleteNodeButton = require('./NodeButton/DeleteNode');

function NodeControls(canvas) {
  this.canvas = canvas;

  this.node = null;

  var addInputButton = new AddInputButton(canvas),
      addOutputButton = new AddOutputButton(canvas),
      deleteNodeButton = new DeleteNodeButton(canvas);

  this.addInputButton = addInputButton;
  this.addOutputButton = addOutputButton;
  this.deleteNodeButton = deleteNodeButton;
}

function nodeControlsAttachTo(node) {
  this.addInputButton.attachTo(node);
  this.addOutputButton.attachTo(node);
  this.deleteNodeButton.attachTo(node);
}

NodeControls.prototype.attachTo = nodeControlsAttachTo;

function nodeControlsDetach() {
  this.addInputButton.detach();
  this.addOutputButton.detach();
  this.deleteNodeButton.detach();
}

NodeControls.prototype.detach = nodeControlsDetach;

module.exports = NodeControls;