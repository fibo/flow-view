export type FlowView = {
	defineElement: () => void;
	instance(element: Element): FlowViewCustomElement;
}

export type FlowViewCustomElement = {
	load(graph: FlowViewGraph): void;
	nodeList: Set<string>;
	nodeTextToBody: (text: string) => FlowViewNodeBodyCreator | undefined;
	nodeTextToType: (text: string) => string | undefined;
	nodeTypeSignature: Map<string, FlowViewNodeSignature>;
	newNode: (arg: FlowViewGraphNode, id?: string) => void;
	newLink: (from: FlowViewPinPath, to: FlowViewPinPath) => void;
}

export type FlowViewNode = {
	text: string;
	id: string;
}

export type FlowViewNodeBodyCreator = (
	node: FlowViewNode,
	view: FlowViewCustomElement
) => HTMLElement;

export type FlowViewPinPath = [nodeId: string, pinIndex: number];

export type FlowViewGraphNode = {
	x: number;
	y: number;
	text: string;
}

export type FlowViewGraph = {
	nodes: Record<string, FlowViewGraphNode>;
	/**
	 * Keys are targets, values are sources.
	 * Where a target is `nodeId:inputIndex` and a source is `nodeId:ouputIndex`.
	 */
	links?: Record<string, string>;
}

export type FlowViewNodeSignature = Partial<{
	inputs: Array<{ name?: string }>
	outputs: Array<{ name?: string }>
}>

export type Vector = {
	x: number
	y: number
}
