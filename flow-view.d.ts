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

export type FlowViewSerializableSemiEdge = Partial<
  Pick<FlowViewSerializableEdge, "from" | "to">
>;

export type FlowViewSerializableGraph = {
  nodes: FlowViewSerializableNode[];
  edges: FlowViewSerializableEdge[];
};

declare class FlowViewBase {
  readonly id: string;
  set ghost(value: boolean);
  set highlighted(value: boolean);
}

declare class FlowViewPin extends FlowViewBase {
  constructor(arg: FlowViewSerializablePin);
  name: string;
  text: string;
}

declare class FlowViewInput extends FlowViewPin {
  toObject(): FlowViewSerializableInput;
}

declare class FlowViewOutput extends FlowViewPin {
  toObject(): FlowViewSerializableOutput;
}

declare class FlowViewNode extends FlowViewBase {
  label: string;
  /**
   * Get input by id.
   *
   * @throws FlowViewErrorItemNotFound
   */
  input(id: FlowViewSerializableInput["id"]): FlowViewInput;
  /**
   * Get output by id.
   *
   * @throws FlowViewErrorItemNotFound
   */
  output(id: FlowViewSerializableOutput["id"]): FlowViewOutput;
  inputs: FlowViewInput[];
  outputs: FlowViewOutput[];
  newInput(arg: Omit<FlowViewSerializablePin, "id">): FlowViewInput;
  newOutput(arg: Omit<FlowViewSerializablePin, "id">): FlowViewOutput;
  toObject(): FlowViewSerializableNode;
}

declare class FlowViewEdge extends FlowViewBase {
  toObject(): FlowViewSerializableEdge;
}

declare type FlowViewGraph = {
  nodes: FlowViewSerializableNode[];
  edges: FlowViewSerializableEdge[];
};

type FlowViewAction =
  | "CREATE_NODE"
  | "CREATE_EDGE"
  | "CREATE_SEMI_EDGE"
  | "DELETE_NODE"
  | "DELETE_EDGE"
  | "DELETE_SEMI_EDGE"
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

  destroy(): void;

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