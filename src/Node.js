
var Input   = require('./Input'),
    Output  = require('./Output')

function Node (canvas, view, key) {
  this.canvas = canvas
  this.key    = key

  var draw  = canvas.draw,
      theme = canvas.theme

  var fillLabel = theme.fillLabel,
      fillRect  = theme.fillRect,
      labelFont = theme.labeFont

  if (typeof view.text === 'undefined')
    view.text = 'callmename'

  if (typeof view.h === 'undefined')
    view.h = 1

  if (typeof view.w === 'undefined')
    view.w = view.text.length + 2

  var h = view.h * theme.unitHeight,
      w = view.w * theme.unitWidth

  var group = this.group = draw.group()

  this.ins  = []
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

  Object.defineProperties(this, {
    'x': { get: function () { return group.x()     } },
    'y': { get: function () { return group.y()     } },
    'w': { get: function () { return rect.width()  } },
    'h': { get: function () { return rect.height() } }
  })

  var numIns  = 0,
      numOuts = 0

  if (view.ins)
    numIns = view.ins.length

  if (view.outs)
    numOuts = view.outs.length

  for (var i = 0; i < numIns; i++)
    this.ins[i] = new Input(this, i, numIns)

  for (var o = 0; o < numOuts; o++)
    this.outs[o] = new Output(this, o, numOuts)

  function dragmove () {
    this.outs.forEach(function (output) {
      Object.keys(output.link).forEach(function (key) {
        var link = output.link[key]

        if (link)
          link.linePlot()
      })
    })

    this.ins.forEach(function (input) {
      var link = input.link

      if (link)
        link.linePlot()
    })
  }

  group.on('dragmove', dragmove.bind(this))

  function focusOnNode (ev) {
    ev.stopPropagation()

    canvas.nodeSelector.hide()

  }

  group.on('click', focusOnNode.bind(this))
}

module.exports = Node

