
var EventEmitter = require('events').EventEmitter,
    inherits     = require('inherits'),
    SVG          = require('./SVG')

var Box  = require('./Box'),
    Link = require('./Link')

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
                                .spof()

  function createBox (key) {
    var view = this.view.box[key]

    this.addBox(view, key)
  }

  Object.keys(view.box)
        .forEach(createBox.bind(this))

  function createLink (key) {
    var view = this.view.link[key]

    this.addLink(view, key)
  }

  Object.keys(view.link).forEach(createLink.bind(this))

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

inherits(Canvas, EventEmitter)

function addBox (view, key) {
  if (typeof key === 'undefined')
     key = this.nextKey

  this.box[key] = new Box(this, view, key)
}

Canvas.prototype.addBox = addBox

function addLink (view, key) {
  if (typeof key === 'undefined')
     key = this.nextKey

  this.link[key] = new Link(this, view, key)
}

Canvas.prototype.addLink = addLink

module.exports = Canvas

