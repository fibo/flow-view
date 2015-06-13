
var Canvas = require('./Canvas')
exports.Canvas = Canvas

function render (element, callback) {
  return function loading (graph) {
    try {
    if (typeof callback === 'function')
      callback(graph)
    }
    catch (message) {
      console.error(message)
    }

    return new Canvas(element, graph.view)
  }
}

exports.render = render

