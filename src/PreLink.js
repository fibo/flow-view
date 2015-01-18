
var Link = require('./Link')

/**
 */

function PreLink (canvas, output) {
  var self = this

  var draw = canvas.draw

  var theme = canvas.theme

  var fillPinHighlighted = theme.fillPinHighlighted,
      halfPinSize        = theme.halfPinSize,
      strokeLine         = theme.strokeLine,
      strokeDasharray    = theme.strokeDasharray

  var pinSize = halfPinSize * 2

  var rect = draw.rect(pinSize, pinSize)
                 .fill(fillPinHighlighted)
                 .move(output.vertex.absolute.x, output.vertex.absolute.y)
                 .draggable()

  Object.defineProperty(this, 'x1', { get: function () { return output.center.absolute.x } })
  Object.defineProperty(this, 'y1', { get: function () { return output.center.absolute.y } })
  Object.defineProperty(this, 'x2', { get: function () { return rect.x() + halfPinSize } })
  Object.defineProperty(this, 'y2', { get: function () { return rect.y() + halfPinSize } })

  var line = draw.line(this.x1, this.y1, this.x2, this.y2)
                 .stroke(strokeLine)
                 .attr('stroke-dasharray', strokeDasharray)

  function remove () {
    output.preLink = null
    rect.remove()
    line.remove()
  }

  rect.on('mouseout', remove)

  function beforedrag () {
    rect.off('mouseout')
  }

  rect.beforedrag = beforedrag

  function dragmove () {
    line.plot(self.x1, self.y1, self.x2, self.y2)
  }

  rect.dragmove = dragmove

  function dragend () {
    // After dragging, the preLink is no longer necessary.
    remove()

    var center = {}

    center.x = rect.x() + halfPinSize
    center.y = rect.y() + halfPinSize

    function dropOn (box) {
      box.inputs.forEach(function (input) {
        if (input.link !== null)
          return

        var bbox = input.rect.bbox()
          , x = input.box.group.x()
          , y = input.box.group.y()

        bbox.x += x
        bbox.x2 += x
        bbox.y += y
        bbox.y2 += y

        var centerIsInsideX = ((center.x >= bbox.x) && (center.x <= bbox.x2))
          , centerIsInsideY = ((center.y >= bbox.y) && (center.y <= bbox.y2))

        var centerIsInsideInput = centerIsInsideX && centerIsInsideY

        if (centerIsInsideInput) {
          var key = canvas.nextKey

          var view = {
            from: output.box.key,
            to: box.key,
            position: input.position
          }

          canvas.link[key] = new Link(canvas, view, key)
        }
      })
    }

    Object.keys(canvas.box).forEach(function (key) {
      var box = canvas.box[key]

      var bbox = box.group.bbox()

      var centerIsInsideX = ((center.x >= bbox.x) && (center.x <= bbox.x2))
        , centerIsInsideY = ((center.y >= bbox.y) && (center.y <= bbox.y2))

      var centerIsInsideBox = centerIsInsideX && centerIsInsideY

      if (centerIsInsideBox)
        dropOn(box)
    })
  }

  rect.dragend = dragend
}

module.exports = PreLink


