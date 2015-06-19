
var EventEmitter = require('events').EventEmitter,
    inherits     = require('inherits'),
    SVG          = require('./SVG')

var Node          = require('./Node'),
    NodeInspector = require('./NodeInspector'),
    NodeSelector  = require('./NodeSelector'),
    Link          = require('./Link')

var defaultTheme = require('./default/theme.json'),
    defaultView  = require('./default/view.json')

function Canvas (id, view, theme) {
  this.view  = view  || defaultView
  this.theme = theme || defaultTheme

  var node = this.node  = {}
  var link = this.link = {}

  var draw = this.draw = SVG(id).size(1000, 1000)
                                .spof()

  function createNode (key) {
    var view = this.view.node[key]

    this.addNode(view, key)
  }

  Object.keys(view.node)
        .forEach(createNode.bind(this))

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

  var nodeSelector = new NodeSelector(this)
  this.nodeSelector = nodeSelector

  var element = document.getElementById(id)

  SVG.on(element, 'dblclick', nodeSelector.show.bind(nodeSelector))
}

inherits(Canvas, EventEmitter)

function addNode (view, key) {
  if (typeof key === 'undefined')
     key = this.nextKey

  this.node[key] = new Node(this, view, key)
}

Canvas.prototype.addNode = addNode

function addLink (view, key) {
  if (typeof key === 'undefined')
     key = this.nextKey

  this.link[key] = new Link(this, view, key)
}

Canvas.prototype.addLink = addLink

module.exports = Canvas

