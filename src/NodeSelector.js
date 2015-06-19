
// TODO autocompletion from json
// http://blog.teamtreehouse.com/creating-autocomplete-dropdowns-datalist-element

function NodeSelector (canvas) {
  var draw  = canvas.draw
  this.draw = draw

  var x = 0
  this.x = x

  var y = 0
  this.y = y

  var foreignObject = draw.foreignObject(100,100)
                          .attr({id: 'flow-view-selector'})

  foreignObject.appendChild('form', {id: 'flow-view-selector-form'})

  var form = foreignObject.getChild(0)
  form.innerHTML = '<input id="flow-view-selector-input" name="node" type="text" autofocus />'

  function createNode () {
    foreignObject.hide()

    var inputText = document.getElementById('flow-view-selector-input')

    var nodeName = inputText.value

    var nodeView = {
      text: nodeName,
      x: this.x,
      y: this.y
    }

    canvas.addNode(nodeView)

    // Remove input text, so next time node selector is shown empty again.
    inputText.value = ''

    // It is required to return false to have a form with no action.
    return false;
  }

  form.onsubmit = createNode.bind(this)

  // Start hidden.
  foreignObject.attr({width: 200, height: 100})
               .move(x, y)
               .hide()

  this.foreignObject = foreignObject
}

function showNodeSelector (ev) {
  var x = ev.clientX,
      y = ev.clientY

  this.x = x
  this.y = y

  this.foreignObject.move(x, y)
                    .show()
}

NodeSelector.prototype.show = showNodeSelector

module.exports = NodeSelector

