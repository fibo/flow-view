
// TODO autocompletion from json
// http://blog.teamtreehouse.com/creating-autocomplete-dropdowns-datalist-element

function BoxSelector (canvas) {
  var draw  = canvas.draw
  this.draw = draw

  var x = 0
  this.x = x

  var y = 0
  this.y = y

  var foreignObject = draw.foreignObject(100,100)
                          .attr({id: 'flow-view-box-selector'})

  foreignObject.appendChild('form', {id: 'flow-view-box-selector-form'})

  var form = foreignObject.getChild(0)
  form.innerHTML = '<input id="box-selector-input" name="box" type="text" autofocus />'

  function createBox () {
    foreignObject.hide()

    var inputText = document.getElementById('box-selector-input')

    var boxName = inputText.value

    var boxView = {
      text: boxName,
      x: this.x,
      y: this.y
    }

    canvas.addBox(boxView)

    // Remove input text, so next time box selector is shown empty again.
    inputText.value = ''

    // It is required to return false to have a form with no action.
    return false;
  }

  form.onsubmit = createBox.bind(this)

  // Start hidden.
  foreignObject.attr({width: 200, height: 100})
               .move(x, y)
               .hide()

  this.foreignObject = foreignObject
}

function showBoxSelector (ev) {
  var x = ev.clientX,
      y = ev.clientY

  this.x = x
  this.y = y

  this.foreignObject.move(x, y)
                    .show()
}

BoxSelector.prototype.show = showBoxSelector

module.exports = BoxSelector

