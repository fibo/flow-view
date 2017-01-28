import { Canvas } from 'flow-view'

const canvas = new Canvas('drawing', {
  node: {
    dad: {
      x: 10, y: 10,
      text: 'Homer'
    },
    mom: {
      x: 60, y: 20,
      text: 'Marge'
    }
  },
  nodeList: [
    'Homer',
    'Marge',
    'Bart',
    'Lisa',
    'Maggie'
  ]
})

canvas.render()
