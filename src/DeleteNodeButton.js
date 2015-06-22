
function DeleteNodeButton (canvas) {
  this.node = null

  this.canvas = canvas

  var draw  = canvas.draw,
      theme = canvas.theme

  var halfPinSize           = theme.halfPinSize,
      strokeLine            = theme.strokeLine,
      strokeLineHighlighted = theme.strokeLineHighlighted

  var size = halfPinSize * 2
  this.size = size

  var group = draw.group()

  var diag1 = draw.line(0, 0, size, size)
                  .stroke(strokeLine)

  var diag2 = draw.line(0, size, size, 0)
                  .stroke(strokeLine)

  group.add(diag1)
       .add(diag2)
       .hide()

  this.group = group

  function delNode () {
    var canvas = this.canvas,
        node   = this.node

    var key = node.key

    this.detach()

    canvas.delNode(key)
  }

  function deselectButton () {
    group.off('click')

    diag1.stroke(strokeLine)
    diag2.stroke(strokeLine)
  }

  group.on('mouseout', deselectButton.bind(this))

  function selectButton () {
    group.on('click', delNode.bind(this))

    diag1.stroke(strokeLineHighlighted)
    diag2.stroke(strokeLineHighlighted)
  }

  group.on('mouseover', selectButton.bind(this))
}

function detachDeleteNodeButton () {
  this.group.hide()

  this.node = null
}

DeleteNodeButton.prototype.detach = detachDeleteNodeButton

function deleteNodeButtonAttachTo (node) {
  var group = this.group

  group.move(node.x + node.w, node.y - this.size)
       .show()

  this.node = node
}

DeleteNodeButton.prototype.attachTo = deleteNodeButtonAttachTo

module.exports = DeleteNodeButton

