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

canvas.render({
  node: {
    dad: {
      x: 10, y: 10,
      text: 'Homer',
      outs: [ 'is father of' ]
    },
    mom: {
      x: 100, y: 20,
      text: 'Marge',
      outs: [ 'is mother of' ]
    },
    son: {
      x: 20, y: 50,
      text: 'Bart',
      ins: [ 'father', 'mother' ]
    },
    daughter: {
      x: 120, y: 40,
      text: 'Lisa',
      ins: [ 'father', 'mother' ]
    }
  },
  link: {}
})
