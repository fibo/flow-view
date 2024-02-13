export declare class FlowView {
  constructor(element: HTMLElement)

  get graph(): FlowViewSerializableGraph

  addNodeDefinitions(nodeDefinitions: { nodes?: FlowViewNodeNameType[]; types?: FlowViewTypeDefinitionRecord }): void

  /**
   * Empty graph.
   */
  clearGraph(): void

  /**
   * Remove corresponding flow-view DOM node.
   */
  destroy(): void

  /**
   * Load a _flow-view_ graph.
   */
  loadGraph(graph: FlowViewGraph): void

  /**
   * Set callback to be invoked on every view change.
   */
  onChange(callback: FlowViewOnChange): void

  /**
   * Get node by id.
   * @throws FlowViewErrorItemNotFound
   */
  node(id: FlowViewSerializableNode["id"]): FlowViewNode

  /**
   * Get edge by id.
   * @throws FlowViewErrorItemNotFound
   */
  edge(id: FlowViewSerializableEdge["id"]): FlowViewEdge

  newNode(arg: Omit<FlowViewSerializableNode, "id"> & Partial<Pick<FlowViewSerializableNode, "id">>): FlowViewNode

  newEdge(arg: Omit<FlowViewSerializableEdge, "id"> & Partial<Pick<FlowViewSerializableEdge, "id">>): FlowViewEdge

  deleteNode(id: FlowViewSerializableNode["id"]): FlowViewSerializableNode

  deleteEdge(id: FlowViewSerializableEdge["id"]): FlowViewSerializableEdge

  /**
   * Add a custom node class.
   * Class must extend FlowViewNode, and should override `initContent()` method.
   * It can define custom style via static `style` attribute.
   * @see {@link https://github.com/fibo/flow-view/tree/main/examples/custom-node/|custom node example}
   */
  addNodeClass(nodeType: string, NodeClass: FlowViewNode): void

  /**
   * Set a function that will be invoked on node creation to resolve node type from node text.
   */
  nodeTextToType(func: FlowViewNodeTextToType): void
}

export declare class FlowViewElement extends HTMLElement {
  readonly host: FlowView

  deselectEdge(edge: FlowViewEdge): void

  deselectNode(node: FlowViewNode): void

  selectEdge(edge: FlowViewEdge): void

  selectNode(node: FlowViewNode): void
}

type FlowViewSerializableItem = {
  id: string
}

type FlowViewSerializablePin = FlowViewSerializableItem

type FlowViewSerializableInput = FlowViewSerializablePin

type FlowViewSerializableOutput = FlowViewSerializablePin

export type FlowViewSerializableNode = FlowViewSerializableItem & {
  text: string

  /**
   * List of input definitions.
   */
  ins?: FlowViewSerializableInput[]

  /**
   * List of output definitions.
   */
  outs?: FlowViewSerializableOutput[]

  /**
   * Node position x coordinate.
   */
  x: number

  /**
   * Node position y coordinate.
   */
  y: number
}

export type FlowViewSerializableEdge = FlowViewSerializableItem & {
  /**
   * Describes the output where edge starts from.
   */
  from: [FlowViewSerializableNode["id"], FlowViewSerializableOutput["id"]]

  /**
   * Describes the input where edge ends to.
   */
  to: [FlowViewSerializableNode["id"], FlowViewSerializableInput["id"]]
}

export type FlowViewSerializableGraph = {
  nodes: FlowViewSerializableNode[]
  edges: FlowViewSerializableEdge[]
}
declare class FlowViewBase {
  readonly id: string
  readonly view: FlowViewElement
  set ghost(value: boolean)
  set hasError(value: boolean)
  set highlighted(value: boolean)
}

export type FlowViewPinConstructorArg = FlowViewSerializablePin & Partial<FlowViewPinDefinition>

declare class FlowViewPin extends FlowViewBase {
  constructor(arg: FlowViewPinConstructorArg)
  name?: string
  text?: string
}

declare class FlowViewInput extends FlowViewPin {
  toObject(): FlowViewSerializableInput
}

declare class FlowViewOutput extends FlowViewPin {
  toObject(): FlowViewSerializableOutput
}

declare class FlowViewNode extends FlowViewBase {
  text: string

  type?: string

  /**
   * Get input by id.
   * @throws FlowViewErrorItemNotFound
   */
  input(id: FlowViewSerializableInput["id"]): FlowViewInput

  inputs: FlowViewInput[]

  /**
   * Get output by id.
   * @throws FlowViewErrorItemNotFound
   */
  output(id: FlowViewSerializableOutput["id"]): FlowViewOutput

  outputs: FlowViewOutput[]

  newInput(arg: Partial<FlowViewPinConstructorArg>): FlowViewInput

  newOutput(arg: Partial<FlowViewPinConstructorArg>): FlowViewOutput

  toObject(): FlowViewSerializableNode
}

declare class FlowViewEdge extends FlowViewBase {
  toObject(): FlowViewSerializableEdge
}

declare type FlowViewGraph = {
  nodes: FlowViewSerializableNode[]
  edges: FlowViewSerializableEdge[]
}

type FlowViewAction =
  | "CREATE_NODE"
  | "CREATE_EDGE"
  | "CREATE_SEMI_EDGE"
  | "DELETE_NODE"
  | "DELETE_EDGE"
  | "DELETE_SEMI_EDGE"
  | "UPDATE_NODE"

export type FlowViewOnChangeDataNode = FlowViewSerializableNode & {
  type?: string
}

export type FlowViewOnChangeDataEdge = FlowViewSerializableEdge

export type FlowViewOnChangeArg = {
  action: FlowViewAction
  data: FlowViewOnChangeDataEdge | FlowViewOnChangeDataNode
}

export type FlowViewOnChangeInfo = {
  isClearGraph?: boolean
  isLoadGraph?: boolean
  isProgrammatic?: boolean
}

export type FlowViewOnChange = (arg: FlowViewOnChangeArg, info: FlowViewOnChangeInfo) => void

export type FlowViewPinDefinition = {
  name: string
}

export type FlowViewTypeDefinition = {
  inputs: Partial<FlowViewPinDefinition>[]
  outputs: Partial<FlowViewPinDefinition>[]
}

export type FlowViewTypeDefinitionRecord = Record<string, FlowViewTypeDefinition>

export type FlowViewNodeNameType = {
  name: string
  type?: string
}

/**
 * Get a node type from node text.
 */
export type FlowViewNodeTextToType = (text: string) => string | undefined

export declare class FlowViewErrorCannotCreateWebComponent extends TypeError {}

export declare class FlowViewErrorCannotLoadStyle extends Error {}

export type FlowViewErrorItemNotFoundConstructorArg = Pick<FlowViewBase, "id"> & { kind: string }

export declare class FlowViewErrorItemNotFound extends Error {
  constructor(arg: FlowViewErrorItemNotFoundConstructorArg)
}
