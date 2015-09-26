
class NodeButton {
  constructor (canvas, relativeCoordinate) {
    this.relativeCoordinate = relativeCoordinate

    this.node = null

    this.canvas = canvas

    this.size = canvas.theme.halfPinSize * 2
    this.group = canvas.svg.group()
  }

  /**
   * Remove button from currently selected node
   */

  detach () {
    this.group.hide()

    this.node = null
  }
}

module.exports = NodeButton

