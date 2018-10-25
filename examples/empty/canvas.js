const Canvas = require('flow-view').Canvas

const container = document.getElementById('drawing')

const canvas = new Canvas(container)

canvas.showInspector()
canvas.pinInspector()
