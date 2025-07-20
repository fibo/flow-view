import { FlowView } from "flow-view"

const flowView = new FlowView(document.querySelector(".container"))

flowView.addNodeDefinitions({
  nodes: [
    { name: "Marge", type: "parent" },
    { name: "Homer", type: "parent" },
    { name: "Bart", type: "child" },
    { name: "Lisa", type: "child" },
    { name: "Barney" },
    { name: "Milhouse", type: "child" },
    { name: "Moe" },
    { name: "Ned", type: "parent" },
    { name: "Patty" },
    { name: "Ralph", type: "child" },
    { name: "Selma" },
    { name: "Mr. Burns" }
  ],
  types: {
    child: {
      inputs: [{ name: "in1" }, { name: "in2" }],
      outputs: []
    }
  }
})

flowView.onChange(({ action, data }) => {
  switch (action) {
    case "CREATE_NODE": {
      const node = flowView.node(data.id)

      switch (data.type) {
        case "parent": {
          if (node.outputs.length === 0) {
            node.newOutput({ name: "out" })
          }
          break
        }
        default:
          break
      }
    }

    default:
      console.info(action, data)
  }
})

const initialGraph = {
  nodes: [
    {
      id: "dad",
      text: "Homer",
      x: 60,
      y: 70,
      outs: [{ id: "children", name: "out" }]
    },
    {
      id: "mom",
      text: "Marge",
      x: 160,
      y: 70,
      outs: [{ id: "children", name: "out" }]
    },
    {
      id: "son",
      text: "Bart",
      x: 60,
      y: 240,
      ins: [
        { id: "father", name: "in1" },
        { id: "mother", name: "in2" }
      ]
    },
    {
      id: "daughter",
      text: "Lisa",
      x: 220,
      y: 220,
      ins: [
        { id: "father", name: "in1" },
        { id: "mother", name: "in2" }
      ]
    }
  ],
  edges: [
    { from: ["dad", "children"], to: ["son", "father"] },
    { from: ["dad", "children"], to: ["daughter", "father"] },
    { from: ["mom", "children"], to: ["son", "mother"] },
    { from: ["mom", "children"], to: ["daughter", "mother"] }
  ]
}

flowView.loadGraph(initialGraph)
