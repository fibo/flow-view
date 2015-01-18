
var Input  = require('./Input'),
    Output = require('./Output')

function Box (canvas, view) {
  this.canvas = canvas

  var draw  = canvas.draw,
      theme = canvas.theme

  var fillLabel = theme.fillLabel,
      fillRect  = theme.fillRect,
      labelFont = theme.labeFont

  var h = view.h * theme.unitHeight,
      w = view.w * theme.unitWidth

  var group = this.group = draw.group()

  this.ins = []
  this.outs = []

  this.draw = draw

  var rect = this.rect = draw.rect(w, h)
                             .fill(fillRect)

  var text = this.text = draw.text(view.text)
                             .fill(fillLabel)
                             .back()
                             .move(10, 10)
                             .font(labelFont)

  group.add(rect)
       .add(text)
       .move(view.x, view.y)
       .draggable()

  Object.defineProperty(this, 'x', { get: function () { return group.x() } })
  Object.defineProperty(this, 'y', { get: function () { return group.y() } })
  Object.defineProperty(this, 'w', { get: function () { return rect.width() } })
  Object.defineProperty(this, 'h', { get: function () { return rect.height() } })

  var numIns  = 0
    , numOuts = 0

  if (view.ins)
    numIns = view.ins.length

  if (view.outs)
    numOuts = view.outs.length

  for (var position = 0; position < numIns; position++)
    this.ins[position] = new Input(this, position, numIns)

  for (var position = 0; position < numOuts; position++)
    this.outs[position] = new Output(this, position, numOuts)

  function dragmove () {
    this.outs.forEach(function (output) {
      Object.keys(output.link).forEach(function (key) {
        var link = output.link[key]

        var x1 = link.x1,
            y1 = link.y1,
            x2 = link.x2,
            y2 = link.y2

        link.line.plot(x1, y1, x2, y2)
      })
    })

    this.ins.forEach(function (input) {
      var link = input.link

      if (!link) return

      var x1 = link.x1
        , y1 = link.y1
        , x2 = link.x2
        , y2 = link.y2

      link.line.plot(x1, y1, x2, y2)
    })
  }

  group.dragmove = dragmove.bind(this)

  function getView () {
    var view = {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      text: this.text
    }
    
    return view
  }

  Object.defineProperty(this, 'view', { get: getView.bind(this) })
}

module.exports = Box

