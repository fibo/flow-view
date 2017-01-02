import React from 'react'
import { Canvas } from 'flow-view'
import { Node } from 'flow-view/components'

// TODO more custom nodes, with foreign object or other stuff

class BigNode extends Node {
  getBody () {
    const {
      bodyHeight,
      text
    } = this.props

    return (
      <text
        x={15}
        y={bodyHeight / 2}
      >
        <tspan>{text}</tspan>
      </text>
    )
  }
}

BigNode.defaultProps = Object.assign({},
  Node.defaultProps,
  {
    bodyHeight: 100
  }
)

const view = {
  width: 400, height: 300,
  node: {
    a: {
      x: 80, y: 10,
      width: 100,
      text: 'Drag me',
      outs: ['out1', 'out2', 'out3']
    },
    b: {
      x: 180, y: 100,
      item: 'BigNode',
      text: 'Big Node',
      ins: [ 'in0' ],
      outs: ['return']
    }
  },
  link: {
    c: {
      from: ['a', 0],
      to: ['b', 0]
    }
  }
}

const canvas = new Canvas('drawing', {
  node: { DefaultNode: Node, BigNode }
})

canvas.render(view)

