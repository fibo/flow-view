
function NodeButton (canvas, relativeCoordinate) {
  this.relativeCoordinate = relativeCoordinate

  this.node = null

  this.canvas = canvas

  var draw  = canvas.draw,
      theme = canvas.theme

  var size = theme.halfPinSize * 2

  this.size = size

  var group = draw.group()

  this.group = group
}

function detachNodeButton () {
  this.group.hide()

  this.node = null
}

NodeButton.prototype.detach = detachNodeButton

module.exports = NodeButton

