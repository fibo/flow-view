var Canvas = require('flow-view').Canvas

var view = require('./sample-view.json')

var canvas = new Canvas('drawing')

canvas.render(view)
