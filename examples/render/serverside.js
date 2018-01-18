const Canvas = require('flow-view').Canvas
const path = require('path')

const view = require(path.join(__dirname, 'sample-view.json'))

const canvas = new Canvas()

canvas.load(view)

const width = 720
const height = 250

canvas.toSVG({ width, height }, (err, outputSVG) => {
  if (err) throw err

  console.log(outputSVG)
})
