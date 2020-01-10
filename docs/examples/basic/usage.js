const { FlowViewCanvas } = require('flow-view')

const graph = require('./graph.json')

const container = document.getElementById('drawing')

const canvas = new FlowViewCanvas(container)

canvas.loadGraph(graph)
