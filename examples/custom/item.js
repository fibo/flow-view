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
      text: 'Root',
      outs: ['out']
    },
    b: {
      x: 180, y: 100,
      item: 'BigNode',
      text: 'Big Node',
      ins: [ 'in0' ],
      outs: ['return']
    },
    c: {
      text: 'Leaf',
      x: 10, y: 200,
      ins: ['in1', 'in2', 'in3']
    }
  },
  link: {
    e: {
      from: ['a', 0],
      to: ['b', 0]
    }
  }
}

const canvas = new Canvas('drawing', {
  node: { DefaultNode: Node, BigNode }
})

canvas.render(view)

