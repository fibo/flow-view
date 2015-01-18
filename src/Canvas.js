
var SVG = require('./svg')

var Box = require('./Box')
  , Link = require('./Link')

function Canvas (id, view) {
  this.theme = {
    unitHeight: 40,
    unitWidth: 10,
    labelFont: {
      family: 'Source Sans Pro',
      size: 17,
      anchor: 'start'
    },
    halfPinSize: 5,
    fillLabel: '#333',
    fillRect: '#ccc',
    fillPin: '#fff',
    strokeDasharray: '5, 5',
    strokeLine: { width: 2 }
  }

  this.view = view

  var box  = this.box  = {}
  var link = this.link = {}

  var draw = this.draw = SVG(id).size(1000, 1000)
                                .fixSubPixelOffset()

  Object.keys(view.box).forEach(this.addBox.bind(this))

  Object.keys(view.link).forEach(this.addLink.bind(this))

  var nextKey = 0

  function getNextKey () {
    var currentKey = ++nextKey + ''

    // Make next key unique.
    if (box[currentKey])
      return getNextKey()

    if (link[currentKey])
      return getNextKey()

    return currentKey
  }

  Object.defineProperty(this, 'nextKey', { get: getNextKey })
}

function addBox (key) {
  this.box[key] = new Box(this, this.view.box[key], key)
}

Canvas.prototype.addBox = addBox

function addLink (key) {
  this.link[key] = new Link(this, this.view.link[key], key)
}

Canvas.prototype.addLink = addLink

module.exports = Canvas

