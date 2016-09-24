import { Canvas } from 'flow-view'

const canvas = new Canvas('drawing')

canvas.on('createNode', () => {
  console.log('createNode')
})

canvas.render()
