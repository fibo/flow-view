
var SVG = require('./svg')

var Box = require('./Box')
  , Link = require('./Link')

var defaultTheme = require('./Theme')
var defaultView = {
  box: {},
  link: {}
}

function Canvas (id, view, theme) {
  this.view  = view  || defaultView
  this.theme = theme || defaultTheme

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

