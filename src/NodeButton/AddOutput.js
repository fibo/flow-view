
var inherits   = require('inherits'),
    NodeButton = require('../NodeButton')

function AddOutput (canvas) {
  NodeButton.call(this, canvas)

  var draw  = canvas.draw,
      theme = canvas.theme

  var halfPinSize           = theme.halfPinSize,
      strokeLine            = theme.strokeLine,
      strokeLineHighlighted = theme.strokeLineHighlighted

  var size = halfPinSize * 2
  this.size = size

  var group = draw.group()

  var line1 = draw.line(0, halfPinSize, size, halfPinSize)
                  .stroke(strokeLine)

  var line2 = draw.line(halfPinSize, 0, halfPinSize, size)
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

inherits(AddOutput, NodeButton)

function attachTo (node) {
  var group = this.group,
      size  = this.size

  group.move(node.x - size, node.y + node.h - size)
       .show()

  this.node = node
}

AddOutput.prototype.attachTo = attachTo

module.exports = AddOutput


