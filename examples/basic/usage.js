import { FlowViewCanvas } from "../../flow-view.min.js";

const graph = {
  nodes: [
    {
      id: "a",
      x: 80,
      y: 100,
      text: "Drag me",
      outs: [
        { id: "out1" },
        { id: "out2" },
        { id: "out3" },
      ],
    },
    {
      id: "b",
      x: 180,
      y: 200,
      text: "Click me",
      ins: [
        { id: "in1" },
        { id: "in2" },
      ],
      outs: [
        { id: "out4" },
      ],
    },
  ],
  links: [
    {
      id: "c",
      from: "out1",
      to: "in1",
    },
  ],
};

const container = document.getElementById("drawing");

const canvas = new FlowViewCanvas(container);

canvas.loadGraph(graph);
