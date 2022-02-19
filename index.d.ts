type ConstructorArg = { container?: HTMLElement; element?: HTMLElement };

type FlowViewSerializedPin = {
  id: string;
  name?: string;
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

export type FlowViewSerializedGraph = {
  nodes: FlowViewSerializedNode[];
  edges: FlowViewSerializedEdge[];
};

declare class FlowViewPin {
  constructor(arg: FlowViewSerializedPin);

  readonly id: string;

  name: string;

  text: string;
}

declare class FlowViewInput extends FlowViewPin {}

declare class FlowViewOutput extends FlowViewPin {}

declare class FlowViewNode {
  readonly id: string;

  label: string;

  newInput(arg: Omit<FlowViewSerializedPin, "id">): FlowViewInput;

  newOutput(arg: Omit<FlowViewSerializedPin, "id">): FlowViewOutput;

  inputs: FlowViewInput[];

  outputs: FlowViewOutput[];
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

export type FlowViewOnChangeArg = {
  action: FlowViewAction;
  data: FlowViewSerializedNode | FlowViewSerializedEdge;
};

export type FlowViewOnChangeInfo = {
  isclearGraph?: boolean;
  isLoadGraph?: boolean;
  isProgrammaticGraph?: boolean;
};

type OnChangeCallback = (
  arg: FlowViewOnChangeArg,
  info: FlowViewOnChangeInfo
) => void;

export declare class FlowView {
  constructor(arg?: ConstructorArg);

  get graph(): FlowViewSerializedGraph;

  addNodeLabels(nodeLabels: string[]): void;

  clearGraph(): void;

  loadGraph(graph: FlowViewGraph): void;

  onChange(arg: OnChangeCallback): void;

  node(id: string): FlowViewNode | undefined;

  edge(id: string): FlowViewEdge | undefined;

  newNode(
    arg: Omit<FlowViewSerializedNode, "id"> &
      Partial<Pick<FlowViewSerializedNode, "id">>
  ): FlowViewNode;

  newEdge(
    arg: Omit<FlowViewSerializedEdge, "id"> &
      Partial<Pick<FlowViewSerializedEdge, "id">>
  ): FlowViewEdge;

  deleteNode(id: FlowViewSerializedNode["id"]): FlowViewSerializedNode;

  deleteEdge(id: FlowViewSerializedEdge["id"]): FlowViewSerializedEdge;
}
