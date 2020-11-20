import { useEffect } from 'react'
import { createFlowViewStore, FlowViewNode, FlowViewNodeLabel } from '../../flow-view'

const flowViewStore = createFlowViewStore()

export function HelloWorld () {
  const appendGraph = flowViewStore((state) => state.appendGraph)
  const setRootDimension = flowViewStore((state) => state.setRootDimension)

  useEffect(() => {
    setRootDimension({ width: 200, height: 200 })
  }, [setRootDimension])

  useEffect(() => {
    appendGraph({
      nodes: [
        {
          id: 1,
          containerId: 0,
          inputs: [],
          outputs: [{ types: [] }],
          position: { x: 40, y: 20 },
          dimension: { width: 100, height: 40 },
          Component: FlowViewNodeLabel,
          label: 'Hello'
        },
        {
          id: 2,
          containerId: 0,
          inputs: [{ types: [] }],
          outputs: [],
          position: { x: 50, y: 90 },
          dimension: { width: 100, height: 40 },
          Component: FlowViewNodeLabel,
          label: 'World'
        }
      ],
      pipes: [
        {
          id: 1,
          containerId: 0,
          source: [1, 0],
          target: [2, 0]
        }
      ]
    })
  }, [appendGraph])

  return <FlowViewNode useStore={flowViewStore} />
}
