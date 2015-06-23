
function NodeButton (canvas) {
  this.node = null

  this.canvas = canvas

  var draw  = canvas.draw,
      theme = canvas.theme

  var size = theme.halfPinSize * 2

  this.size = size

  var group = draw.group()

  this.group = group
}

function nodeButtonAttachTo (node) {
  var group = this.group,
      x     = this.x,
      y     = this.y

  group.move(node.x + node.w, node.y - this.size)
       .show()

  this.node = node
}

NodeButton.prototype.attachTo = nodeButtonAttachTo

function detachNodeButton () {
  this.group.hide()

  this.node = null
}

NodeButton.prototype.detach = detachNodeButton

function nodeButtonAttachTo (node) {
  var group = this.group

  group.move(node.x + node.w, node.y - this.size)
       .show()

  this.node = node
}

NodeButton.prototype.attachTo = nodeButtonAttachTo

module.exports = NodeButton

