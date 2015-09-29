
var NodeButton = require('../NodeButton')

class AddOutput extends NodeButton {
  constructor (canvas) {
    super(canvas)

  var svg   = canvas.svg,
      theme = canvas.theme

  var halfPinSize           = theme.halfPinSize,
      strokeLine            = theme.strokeLine,
      strokeLineHighlighted = theme.strokeLineHighlighted

  var size = halfPinSize * 2
  this.size = size

  var group = svg.group()

  var line1 = svg.line(0, halfPinSize, size, halfPinSize)
                 .stroke(strokeLine)

  var line2 = svg.line(halfPinSize, 0, halfPinSize, size)
                 .stroke(strokeLine)

  group.add(line1)
       .add(line2)
       .hide()

  this.group = group

  function addOutput (ev) {
    this.node.addOutput()
  }

  function deselectButton () {
    group.off('click')

    line1.stroke(strokeLine)
    line2.stroke(strokeLine)
  }

  group.on('mouseout', deselectButton.bind(this))

  function selectButton () {
    group.on('click', addOutput.bind(this))

    line1.stroke(strokeLineHighlighted)
    line2.stroke(strokeLineHighlighted)
  }

  group.on('mouseover', selectButton.bind(this))
}

  attachTo (node) {
  var group = this.group,
      size  = this.size

  group.move(node.x - size, node.y + node.h - size)
       .show()

  this.node = node
  }
}

module.exports = AddOutput


