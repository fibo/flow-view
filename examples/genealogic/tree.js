import { Canvas } from 'flow-view'

const canvas = new Canvas('drawing', {
  nodeList: [
    'Homer',
    'Marge',
    'Bart',
    'Lisa',
    'Maggie'
  ]
})

canvas.render()
