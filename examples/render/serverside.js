const Canvas = require('flow-view').Canvas
const path = require('path')

const view = require(path.join(__dirname, 'sample-view.json'))

const canvas = new Canvas('drawing')

canvas.render(view, function (err, outputSVG) {
  if (err) throw err

  console.log(outputSVG)
})
