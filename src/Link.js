
function Link (canvas, view, key) {
  var draw = canvas.draw

  var theme = canvas.theme

  var strokeLine            = theme.strokeLine,
      strokeLineHighlighted = theme.strokeLineHighlighted

  var from = canvas.box[view.from[0]],
      to   = canvas.box[view.to[0]]

  var start = from.outs[view.from[1]],
      end   = to.ins[view.to[1]]

  Object.defineProperty(this, 'x1', { get: function () { return start.center.absolute.x } })
  Object.defineProperty(this, 'y1', { get: function () { return start.center.absolute.y } })
  Object.defineProperty(this, 'x2', { get: function () { return end.center.absolute.x } })
  Object.defineProperty(this, 'y2', { get: function () { return end.center.absolute.y } })

  var line = this.line = draw.line(this.x1, this.y1, this.x2, this.y2)
                             .stroke(strokeLine)

  end.link = this
  start.link[key] = this

  function remove () {
    end.link = null
    delete start.link[key]
    delete canvas.view.link[key]
    line.remove()
  }

  function deselectLine () {
    line.off('click')
        .stroke(strokeLine)
  }

  function selectLine () {
    line.on('click', remove)
        .stroke(strokeLineHighlighted)
  }

  line.on('mouseover', selectLine)
  line.on('mouseout', deselectLine)
}

function linePlot () {
var line = this.line,
    x1   = this.x1,
    y1   = this.y1,
    x2   = this.x2,
    y2   = this.y2

  line.plot(x1, y1, x2, y2)
}

Link.prototype.linePlot

module.exports = Link

