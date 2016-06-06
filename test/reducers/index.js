/*
import test from 'tape'
import initialState from 'util/initialState'
import deepFreeze from 'deep-freeze'
import flowViewApp from 'reducers'
import {
  ADD_NODE, DEL_NODE
} from 'actions'

test('addNode', (t) => {
  const stateBefore = initialState

  const action = {
    type: ADD_NODE,
    data: {
      ins: [],
      outs: [],
      text: 'new node',
      x: 10,
      y: 20,
      w: 100,
      h: 20
    }
  }

  const stateAfter = flowViewApp(stateBefore, action)

  deepFreeze(stateBefore)
  const id = Object.keys(stateAfter.node)[0]

  t.deepEqual(stateAfter.node[id], action.data, 'created')

  t.end()
})

test('delNode', (t) => {
  const stateBefore = {
    node: {
      id1: {
        ins: [],
        outs: [{ name: 'ret' }],
        text: 'node1',
        x: 10,
        y: 20,
        w: 100,
        h: 20
      },
      id2: {
        ins: [
          { name: 'arg0' },
          { name: 'arg1' }
        ],
        outs: [],
        text: 'node2',
        x: 110,
        y: 20,
        w: 100,
        h: 20
      }
    },
    link: {
      id3: {
        from: ['id1', 0],
        to: ['id2', 1]
      }
    }
  }

  const action = {
    type: DEL_NODE,
    data: {
      id: 'id1'
    }
  }

  const stateAfter = flowViewApp(stateBefore, action)

  deepFreeze(stateBefore)

  let expectedState = Object.assign({}, stateBefore)

  delete expectedState.node.id1
  delete expectedState.link.id3

  t.deepEqual(stateAfter, expectedState)

  t.end()
})
*/
