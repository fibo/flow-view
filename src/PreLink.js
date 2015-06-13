
var Link = require('./Link')

function PreLink (canvas, output) {
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

  rect.on('beforedrag', beforedrag)

  function dragmove () {
    line.plot(this.x1, this.y1, this.x2, this.y2)
  }

  rect.on('dragmove', dragmove.bind(this))

  function dragend () {
    // After dragging, the preLink is no longer necessary.
    remove()

    var center = {}

    //center.x = rect.x() + halfPinSize
    center.x = this.x2
    //center.y = rect.y() + halfPinSize
    center.y = this.y2

    function isInside (center) {
      function centerIsInside (bbox, x, y) {
        var centerIsInsideX = ((center.x >= bbox.x + x) && (center.x <= bbox.x2 + x)),
            centerIsInsideY = ((center.y >= bbox.y + y) && (center.y <= bbox.y2 + y))

        return centerIsInsideX && centerIsInsideY
      }

      return centerIsInside
    }

    var centerIsInside = isInside(center)

    /**
     * Given a box, loop over its ins.
     * If center is inside input, create a Link.
     */

    function dropOn (box) {
      box.ins.forEach(function (input) {
        if (input.link !== null)
          return

        var bbox = input.rect.bbox(),
            x    = input.box.group.x(),
            y    = input.box.group.y()

        /*
        var centerIsInsideX = ((center.x >= bbox.x + x) && (center.x <= bbox.x2 + x)),
            centerIsInsideY = ((center.y >= bbox.y + y) && (center.y <= bbox.y2 + y))

            */
        //var centerIsInsideInput = centerIsInsideX && centerIsInsideY
        var centerIsInsideInput = centerIsInside(bbox, x, y)

        if (centerIsInsideInput) {
          var view = {
            from: [output.box.key, output.position],
            to: [box.key, input.position]
          }

          canvas.addLink(view)
        }
      })
    }

    // Loop over all boxes. If center is inside box, drop on it.
    Object.keys(canvas.box).forEach(function (key) {
      var box = canvas.box[key]

      var bbox = box.group.bbox(),
            x  = box.x,
            y  = box.y

      /*
        bbox.x  += x
        bbox.x2 += x
        bbox.y  += y
        bbox.y2 += y

      var centerIsInsideX = ((center.x >= bbox.x) && (center.x <= bbox.x2)),
          centerIsInsideY = ((center.y >= bbox.y) && (center.y <= bbox.y2))

      var centerIsInsideBox = centerIsInsideX && centerIsInsideY
      */
        var centerIsInsideBox = centerIsInside(bbox, x, y)

      if (centerIsInsideBox)
        dropOn(box)
    })
  }

  rect.on('dragend', dragend.bind(this))
}

module.exports = PreLink


