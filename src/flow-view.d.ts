export type FlowViewStaticMethod = {
	instance(element: Element | null): FlowViewCustomElement;
};

export type FlowViewCustomElement = HTMLElement & {
	clear(): void;
	load(graph: FlowViewGraph): void;
	readonly graph: FlowViewGraph;
	readonly nodeList: Set<string>;
	readonly nodeTypeSignature: Map<string, FlowViewNodeSignature>;
	nodeTextToBody: (text: string) => FlowViewNodeBodyCreator | undefined;
	nodeTextToType: (text: string) => string | undefined;
	onChange(callback: (detail: FlowViewChangeEventDetail) => void): void;
};

// TODO consider removing this
export type FlowViewNode = {
	text: string;
	id: string;
};

export type FlowViewNodeBodyCreator = (
	node: FlowViewNode,
	view: FlowViewCustomElement
) => HTMLElement;

export type FlowViewPinPath = [nodeId: string, pinIndex: number];

export type FlowViewGraphNode = {
	x: number;
	y: number;
	text: string;
};

/**
 * Keys are node ids.
 */
export type FlowViewGraphNodes = Record<string, FlowViewGraphNode>;

/**
 * Keys are targets, values are sources.
 * Where a target is `nodeId:inputIndex` and a source is `nodeId:ouputIndex`.
 */
export type FlowViewGraphLinks = Record<string, string>;

export type FlowViewGraph = {
	nodes: FlowViewGraphNodes;
	links?: FlowViewGraphLinks;
};

export type FlowViewPinMetadata = {
	name?: string;
};

export type FlowViewNodeSignature = Partial<{
	inputs: FlowViewPinMetadata[];
	outputs: FlowViewPinMetadata[];
}>;

export type FlowViewChangeEventDetail = Partial<{
	create: Partial<FlowViewGraph>;
	delete: Partial<FlowViewGraph>;
}>
