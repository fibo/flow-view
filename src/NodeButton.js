
function NodeButton (canvas, relativeCoordinate) {
  this.relativeCoordinate = relativeCoordinate

  this.node = null

  this.canvas = canvas

  this.size = canvas.theme.halfPinSize * 2
  this.group = canvas.svg.group()
}

/**
 * Remove button from currently selected node
 */

function detachNodeButton () {
  this.group.hide()

  this.node = null
}

NodeButton.prototype.detach = detachNodeButton

module.exports = NodeButton

