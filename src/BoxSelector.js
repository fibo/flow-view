
function BoxSelector (canvas) {
  this.draw = draw

}

function showBoxSelector () {
  console.log('show box selector')
}

BoxSelector.prototype.show = showBoxSelector

module.exports = BoxSelector

