
function Pin (type, node, position) {
  this.type     = type
  this.node     = node
  this.position = position

}

function get (key) {
  var node     = this.node,
      position = this.position,
      type     = this.type

  return node[type][position][key]
}

Pin.prototype.get = get

function has (key) {
  var node     = this.node,
      position = this.position,
      type     = this.type

  return typeof node[type][position][key] !== 'undefined'
}

Pin.prototype.has = has

function set (key, data) {
  var node     = this.node,
      position = this.position,
      type     = this.type

  this.node[type][position][key] = data
}

Pin.prototype.set = set

module.exports = Pin

