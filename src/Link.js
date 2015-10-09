
/**
 * Connect an output to an input
 *
 * @param {Object} canvas
 * @param {String} key
 */

function Link (canvas, key) {
  this.canvas = canvas
  this.key    = key
}

function render (view) {
  var canvas = this.canvas,
      key    = this.key

  var broker = canvas.broker,
      node  = canvas.node,
      svg    = canvas.svg,
      theme  = canvas.theme

  var strokeLine            = theme.strokeLine,
      strokeLineHighlighted = theme.strokeLineHighlighted

  var from = node[view.from[0]],
      to   = node[view.to[0]]

  var start = from.outs[view.from[1]],
      end   = to.ins[view.to[1]]

  Object.defineProperties(this, {
    'from' : { value: from  },
    'to'   : { value: to    },
    'start': { value: start },
    'end'  : { value: end   }
  })

  Object.defineProperties(this, {
    'x1': { get: function () { return start.center.absolute.x } },
    'y1': { get: function () { return start.center.absolute.y } },
    'x2': { get: function () { return end.center.absolute.x   } },
    'y2': { get: function () { return end.center.absolute.y   } }
  })

  var line = svg.line(this.x1, this.y1, this.x2, this.y2)
                .stroke(strokeLine)

  this.line = line

  end.link = this
  start.link[key] = this

  function remove () {
    broker.emit('delLink', key)
  }

  function deselectLine () {
    line.off('click')
        .stroke(strokeLine)
  }

  line.on('mouseout', deselectLine)

  function selectLine () {
    line.on('click', remove)
        .stroke(strokeLineHighlighted)
  }

  line.on('mouseover', selectLine)
}

Link.prototype.render = render

function deleteView () {
  var canvas = this.canvas,
      end    = this.end,
      key    = this.key,
      line   = this.line,
      start  = this.start

  line.remove()

  end.link = null

  delete start.link[key]

  delete canvas.link[key]
}

Link.prototype.deleteView = deleteView

function toJSON () {
  var view = { from: [], to: [] }

  view.from[0] = this.from.key
  view.from[1] = this.start.position

  view.to[0] = this.to.key
  view.to[1] = this.end.position

  return view
}

Link.prototype.toJSON = toJSON

function linePlot () {
  var line = this.line,
      x1   = this.x1,
      y1   = this.y1,
      x2   = this.x2,
      y2   = this.y2

  line.plot(x1, y1, x2, y2)
}

Link.prototype.linePlot = linePlot

module.exports = Link

