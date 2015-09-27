
var AddInputButton   = require('./NodeButton/AddInput'),
    AddOutputButton  = require('./NodeButton/AddOutput'),
    DeleteNodeButton = require('./NodeButton/DeleteNode')

class NodeControls {
  constructor (canvas) {
    this.canvas = canvas

    this.node = null

    var addInputButton   = new AddInputButton(canvas),
        addOutputButton  = new AddOutputButton(canvas),
        deleteNodeButton = new DeleteNodeButton(canvas)

    this.addInputButton   = addInputButton
    this.addOutputButton  = addOutputButton
    this.deleteNodeButton = deleteNodeButton
  }

  attachTo (node) {
    this.addInputButton.attachTo(node)
    this.addOutputButton.attachTo(node)
    this.deleteNodeButton.attachTo(node)
  }

  detach () {
    this.addInputButton.detach()
    this.addOutputButton.detach()
    this.deleteNodeButton.detach()
  }
}

module.exports = NodeControls

