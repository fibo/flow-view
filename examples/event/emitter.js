import { Canvas } from 'flow-view'

const canvas = new Canvas('drawing')

canvas.on('createLink', (link, id) => {
  console.log('createLink', link, id)
})

canvas.on('createNode', (node, nodeId) => {
  console.log('createNode', node, nodeId)
})

canvas.on('createInputPin', (nodeId, position, pin) => {
  console.log('createInputPin', nodeId, position, pin)
})

canvas.on('createOutputPin', (nodeId, position, pin) => {
  console.log('createOutputPin', nodeId, position, pin)
})

canvas.on('deleteLink', (linkId) => {
  console.log('deleteLink', linkId)
})

canvas.on('deleteNode', (nodeId) => {
  console.log('deleteNode', nodeId)
})

canvas.on('deleteInputPin', (nodeId, position, pin) => {
  console.log('deleteInputPin', nodeId, position, pin)
})

canvas.on('deleteOutputPin', (nodeId, position) => {
  console.log('deleteOutputPin', nodeId, position)
})

canvas.on('renameNode', (nodeId, text) => {
  console.log('renameNode', nodeId, text)
})

canvas.render({
  node: {
    a: {
      x: 10,
      y: 10,
      text: 'Events are printed below'
    }
  }
})

var consoleLogDiv = document.createElement('script')
consoleLogDiv.src = 'https://rawgit.com/bahmutov/console-log-div/master/console-log-div.js'
document.body.appendChild(consoleLogDiv)
