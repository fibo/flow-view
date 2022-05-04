declare class FlowViewElement extends HTMLElement {}

declare class FlowViewErrorItemNotFound extends Error {}

type FlowViewConstructorArg = {
  container?: HTMLElement;
  element?: HTMLElement;
  CustomElement?: FlowViewElement;
};

type FlowViewSerializablePin = {
  id: string;
  name?: string;
};

type FlowViewSerializableInput = FlowViewSerializablePin;

type FlowViewSerializableOutput = FlowViewSerializablePin;

export type FlowViewSerializableNode = {
  id: string;
  type?: string;
  label?: string;
  x: number;
  y: number;
  inputs?: FlowViewSerializableInput[];
  outputs?: FlowViewSerializableOutput[];
};

export type FlowViewSerializableEdge = {
  id: string;
  from: [FlowViewSerializableNode["id"], FlowViewSerializableOutput["id"]];
  to: [FlowViewSerializableNode["id"], FlowViewSerializableInput["id"]];
};

export type FlowViewSerializableGraph = {
  nodes: FlowViewSerializableNode[];
  edges: FlowViewSerializableEdge[];
};

declare class FlowViewPin {
  constructor(arg: FlowViewSerializablePin);

  readonly id: string;

  name: string;

  text: string;
}

declare class FlowViewInput extends FlowViewPin {}

declare class FlowViewOutput extends FlowViewPin {}

declare class FlowViewNode {
  readonly id: string;

  label: string;

  newInput(arg: Omit<FlowViewSerializablePin, "id">): FlowViewInput;

  newOutput(arg: Omit<FlowViewSerializablePin, "id">): FlowViewOutput;

  inputs: FlowViewInput[];

  outputs: FlowViewOutput[];
}

declare class FlowViewEdge {
  readonly id: string;
}

declare type FlowViewGraph = {
  nodes: FlowViewSerializableNode[];
  edges: FlowViewSerializableEdge[];
};

type FlowViewAction =
  | "CREATE_NODE"
  | "CREATE_EDGE"
  | "DELETE_NODE"
  | "DELETE_EDGE"
  | "UPDATE_NODE";

export type FlowViewOnChangeArg = {
  action: FlowViewAction;
  data: FlowViewSerializableNode | FlowViewSerializableEdge;
};

export type FlowViewOnChangeInfo = {
  isClearGraph?: boolean;
  isLoadGraph?: boolean;
  isProgrammatic?: boolean;
};

type OnChangeCallback = (
  arg: FlowViewOnChangeArg,
  info: FlowViewOnChangeInfo
) => void;

export declare class FlowView {
  constructor(arg?: FlowViewConstructorArg);

  get graph(): FlowViewSerializableGraph;

  addNodeLabels(nodeLabels: string[]): void;

  clearGraph(): void;

  loadGraph(graph: FlowViewGraph): void;

  onChange(arg: OnChangeCallback): void;

  /**
   * Get node by id.
   *
   * @throws FlowViewErrorItemNotFound
   */
  node(id: FlowViewSerializableNode["id"]): FlowViewNode;

  /**
   * Get edge by id.
   *
   * @throws FlowViewErrorItemNotFound
   */
  edge(id: FlowViewSerializableEdge["id"]): FlowViewEdge;

  newNode(
    arg: Omit<FlowViewSerializableNode, "id"> &
      Partial<Pick<FlowViewSerializableNode, "id">>
  ): FlowViewNode;

  newEdge(
    arg: Omit<FlowViewSerializableEdge, "id"> &
      Partial<Pick<FlowViewSerializableEdge, "id">>
  ): FlowViewEdge;

  deleteNode(id: FlowViewSerializableNode["id"]): FlowViewSerializableNode;

  deleteEdge(id: FlowViewSerializableEdge["id"]): FlowViewSerializableEdge;

  addNodeClass(nodeType: string, NodeClass: FlowViewNode): void;
}
