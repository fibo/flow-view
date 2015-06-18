
function BoxSelector (canvas) {
  var draw  = canvas.draw
  this.draw = draw

  var foreignObject = draw.foreignObject(100,100)
                          .attr({id: 'flow-view-box-selector'})

  var txt = "this is a box selector"
  foreignObject.appendChild("div", {id: 'mydiv', innerText: txt})

  var n = foreignObject.getChild(0)
  foreignObject.attr({width: 200, height: 100}).rotate(45).move(100,0)

  n.style.height = '50px'
  n.style.overflow = 'hidden'
  n.style.border = "solid black 1px"
}

function showBoxSelector () {
  console.log('show box selector')
}

BoxSelector.prototype.show = showBoxSelector

module.exports = BoxSelector

