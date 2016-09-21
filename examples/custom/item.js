import { Canvas } from 'flow-view'
import { Link, Node } from 'flow-view/components'

class BigNode extends Node {}

const view = {
  width: 400, height: 300,
  node: {
    a: {
      x: 80, y: 100,
      width: 100,
      text: 'Drag me',
      outs: ['out1', 'out2', 'out3']
    },
    b: {
      x: 180, y: 200,
      item: 'BigNode',
      text: 'Click me',
      ins: ['in0', { name: 'in1', type: 'bool' }],
      outs: ['return']
    }
  },
  link: {
    c: {
      from: ['a', 0],
      to: ['b', 1]
    }
  }
}

const canvas = new Canvas('drawing', { item: {
  link: { DefaulLink: Link },
  node: { DefaulNode: Node, BigNode }
}})

canvas.render(view)

