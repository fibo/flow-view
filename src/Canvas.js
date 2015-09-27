
var SVG = require('./SVG')

var Broker        = require('./Broker'),
    Link          = require('./Link'),
    Node          = require('./Node'),
    NodeControls  = require('./NodeControls'),
    NodeCreator   = require('./NodeCreator'),
    validate      = require('./validate')

var defaultTheme = require('./default/theme.json'),
    defaultView  = require('./default/view.json')

/**
 * Create a flow-view canvas
 *
 * @param {String} id of div
 * @param {Object} arg can contain width, height, eventHooks
 */

class Canvas {
  constructor (id, arg) {
    var self = this
   
    var broker = new Broker(this)
    broker.init(arg.eventHooks)
    this.broker = broker

    var theme = defaultTheme
    this.theme = theme

    var node = this.node = {}
    var link = this.link = {}

    var svg = this.svg = SVG(id)

    var element = document.getElementById(id)

    var height = this.height = element.clientHeight
    var width  = this.width  = element.clientWidth

    svg.size(width, height).spof()

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

    var nodeCreator  = this.nodeCreator  = new NodeCreator(this)
    var nodeControls = this.nodeControls = new NodeControls(this)

    var hideNodeCreator = nodeCreator.hide.bind(nodeCreator),
        showNodeCreator = nodeCreator.show.bind(nodeCreator)

    SVG.on(element, 'click',    hideNodeCreator)
    SVG.on(element, 'dblclick', showNodeCreator)
  }

  render (view) {
    validate(view)

    var addLink = this.addLink,
        addNode = this.addNode

    function createNode (key) {
      addNode(view.node[key], key)
    }

    Object.keys(view.node).forEach(createNode)

    function createLink (key) {
      addLink(view.link[key], key)
    }

    Object.keys(view.link).forEach(createLink)
  }

  /**
  *
  * @returns {Object} json
  */

  toJSON () {
    var view = { link: {}, node: {} }

    var link = this.link,
        node = this.node

    Object.keys(link).forEach(function (key) {
      view.link[key] = link[key].toJSON()
    })

    Object.keys(node).forEach(function (key) {
      view.node[key] = node[key].toJSON()
    })

    return view
  }

  addLink (view, key) {
    if (typeof key === 'undefined')
      key = this.nextKey

    var link = new Link(this, key)

    link.render(view)

    this.link[key] = link

    var eventData = { link: {} }
    eventData.link[key] = view
  }

  addNode (view, key) {
    if (typeof key === 'undefined')
      key = this.nextKey

    var node = new Node(this, key)

    node.render(view)

    this.node[key] = node

    var eventData = { node: {} }
    eventData.node[key] = view
  }

  delNode (key) {
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
    node.deleteView()
  }

  delLink (key) {
    var link = this.link[key]

    link.deleteView()
  }
}


module.exports = Canvas

