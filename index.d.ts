type ConstructorArg = { container?: HTMLElement; element?: HTMLElement };

type FlowViewSerializedPin = {
  id: string;
  name: string;
};

type FlowViewSerializedInput = FlowViewSerializedPin;

type FlowViewSerializedOutput = FlowViewSerializedPin;

export type FlowViewSerializedNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  inputs: FlowViewSerializedInput[];
  outputs: FlowViewSerializedOutput[];
};

export type FlowViewSerializedEdge = {
  id: string;
  from: [FlowViewSerializedNode["id"], FlowViewSerializedOutput["id"]];
  to: [FlowViewSerializedNode["id"], FlowViewSerializedInput["id"]];
};

declare class FlowViewPin {
  constructor(arg: FlowViewSerializedPin);
}

declare class FlowViewInput extends FlowViewPin {}

declare class FlowViewOutput extends FlowViewPin {}

declare class FlowViewNode {
  readonly id: string;

  newInput(arg: Omit<FlowViewSerializedPin, "id">): FlowViewInput;
}

declare class FlowViewEdge {
  readonly id: string;
}

declare type FlowViewGraph = {
  nodes: FlowViewSerializedNode[];
  edges: FlowViewSerializedEdge[];
};

type FlowViewAction =
  | "CREATE_NODE"
  | "CREATE_EDGE"
  | "DELETE_NODE"
  | "DELETE_EDGE";

type OnChangeCallback = (arg: {
  action: FlowViewAction;
  data: FlowViewSerializedNode | FlowViewSerializedEdge;
}) => void;

export declare class FlowView {
  constructor(arg?: ConstructorArg);

  addNodeLabels(nodeLabels: string[]);

  clearGraph();

  loadGraph(FlowViewGraph);

  onChange(arg: OnChangeCallback);

  node(id: string): FlowViewNode;

  edge(id: string): FlowViewEdge;

  newNode(
    arg: Omit<FlowViewSerializedNode, "id"> &
      Partial<Pick<FlowViewSerializedNode, "id">>
  ): FlowViewNode;

  newEdge(
    arg: Omit<FlowViewSerializedEdge, "id"> &
      Partial<Pick<FlowViewSerializedEdge, "id">>
  ): FlowViewEdge;
}
