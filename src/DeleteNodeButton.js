
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

  group.on('click', function () { console.log('delete') })

  this.group = group
}

function hideDeleteNodeButton () {
  this.group.hide()
  this.node = null
}

DeleteNodeButton.prototype.hide = hideDeleteNodeButton

function attachTo (node) {
  var group = this.group

  group.move(node.x + node.w, node.y - this.size)
       .show()

  this.node = node

}

DeleteNodeButton.prototype.hide = hideDeleteNodeButton

module.exports = DeleteNodeButton


