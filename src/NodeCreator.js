
// TODO autocompletion from json
// http://blog.teamtreehouse.com/creating-autocomplete-dropdowns-datalist-element

function NodeCreator (canvas) {
  var draw  = canvas.draw
  this.draw = draw

  var x = 0
  this.x = x

  var y = 0
  this.y = y

  var foreignObject = draw.foreignObject(100,100)
                          .attr({id: 'flow-view-selector'})

  foreignObject.appendChild('form', {id: 'flow-view-selector-form', name: 'nodecreator'})

  var form = foreignObject.getChild(0)

  form.innerHTML = '<input id="flow-view-selector-input" name="selectnode" type="text" autofocus />'

  // TODO give focus to input text
  form.selectnode.focus()

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
    return false
  }

  form.onsubmit = createNode.bind(this)

  // Start hidden.
  foreignObject.attr({width: 200, height: 100})
               .move(x, y)
               .hide()

  this.foreignObject = foreignObject
}

function hideNodeCreator (ev) {
  this.foreignObject.hide()
}

NodeCreator.prototype.hide = hideNodeCreator

function showNodeCreator (ev) {
  var x = ev.offsetX,
      y = ev.offsetY

  this.x = x
  this.y = y

  this.foreignObject.move(x, y)
                    .show()
}

NodeCreator.prototype.show = showNodeCreator

module.exports = NodeCreator

