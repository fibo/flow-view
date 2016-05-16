import test from 'tape'
import nodes from 'reducers/nodes'
import { ADD_NODE } from 'actions'
import deepFreeze from 'deep-freeze'

test('add node', (t) => {
  const stateBefore = { node: {}, link: {} }

  const action = {
    type: ADD_NODE,
    data: {
      ins: [],
      outs: [],
      text: 'new node'
    }
  }

  const stateAfter = nodes(stateBefore, action)

  deepFreeze(stateBefore)

  const id = Object.keys(stateAfter.node)[0]

  t.deepEqual(stateAfter.node[id], action.data)

  t.end()
})
