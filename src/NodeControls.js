
var DeleteNodeButton = require('./NodeButton/DeleteNode')

function NodeControls (canvas) {
  this.canvas = canvas

  this.node = null

  var deleteNodeButton = new DeleteNodeButton(canvas)
  this.deleteNodeButton = deleteNodeButton
}

function nodeControlsAttachTo (node) {
  this.deleteNodeButton.attachTo(node)
}

NodeControls.prototype.attachTo = nodeControlsAttachTo

function nodeControlsDetach () {
  this.deleteNodeButton.detach()
}

NodeControls.prototype.detach = nodeControlsDetach

module.exports = NodeControls

