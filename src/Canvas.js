
var EventEmitter = require('events').EventEmitter,
    inherits     = require('inherits'),
    SVG          = require('./SVG')

var Node          = require('./Node'),
    NodeControls  = require('./NodeControls'),
    NodeCreator   = require('./NodeCreator'),
    NodeInspector = require('./NodeInspector'),
    Link          = require('./Link')

var defaultTheme = require('./default/theme.json'),
    defaultView  = require('./default/view.json')

function Canvas (id, view) {
  this.view  = view || defaultView

  var theme = defaultTheme
  this.theme = theme

  var node = this.node = {}
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
    if (node[currentKey])
      return getNextKey()

    if (link[currentKey])
      return getNextKey()

    return currentKey
  }

  Object.defineProperty(this, 'nextKey', { get: getNextKey })

  var nodeCreator  = new NodeCreator(this)
  this.nodeCreator = nodeCreator

  var nodeInspector  = new NodeInspector(this)
  this.NodeInspector = NodeInspector

  var nodeControls = new NodeControls(this)
  this.nodeControls = nodeControls

  var element = document.getElementById(id)

  SVG.on(element, 'dblclick', nodeCreator.show.bind(nodeCreator))
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

function delNode (key) {
  var link = this.link,
      node = this.node[key]

  // First remove links connected to node.
  for (var i in link) {
    var nodeIsSource = link[i].from.key === key,
        nodeIsTarget = link[i].to.key   === key

    if (nodeIsSource || nodeIsTarget)
      this.delLink(i)
  }

  // Then remove node.
  node.group.remove()
  delete this.node[key]

  this.emit('delNode', key)
}

Canvas.prototype.delNode = delNode

function delLink (key) {
  var link = this.link[key]

  link.line.remove()

  delete this.link[key]

  this.emit('delLink', key)
}

Canvas.prototype.delLink = delLink

module.exports = Canvas

