export declare class FlowView {
	/**
	 * Create or retrieve a flow-view instance.
	 *
	 * @example Get a flow-view instance
	 * const flowView = FlowView.instance(document.querySelector('flow-view'));
	 *
	 * @example Create a new flow-view instance inside a container.
	 * const flowView = FlowView.instance(document.querySelector('.container'));
	 */
	static instance(element: Element | null): HTMLFlowViewElement;
}

/**
 * @event {FlowViewChangeEvent} fv:change
 */
export type HTMLFlowViewElement = HTMLElement & {
	clear(): void;
	load(graph: FlowViewGraph): void;
	undo(): void;
	readonly adoptedStyleSheets: ShadowRoot['adoptedStyleSheets'];
	readonly graph: FlowViewGraph;
	readonly nodeList: Set<string>;
	readonly nodeTypeSignature: Map<string, FlowViewNodeSignature>;
	nodeTextToBody: (text: string) => FlowViewNodeBodyCreator | undefined;
	nodeTextToType: (text: string) => string | undefined;
};

export type FlowViewNode = {
	text: string;
	id: string;
};

export type FlowViewNodeBodyCreator = (node: FlowViewNode, view: HTMLFlowViewElement) => HTMLElement;

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
	links: FlowViewGraphLinks;
};

export type FlowViewPinMetadata = {
	name?: string;
};

export type FlowViewNodeSignature = Partial<{
	inputs: FlowViewPinMetadata[];
	outputs: FlowViewPinMetadata[];
}>;

export type FlowViewChangeEventDetail = Partial<{
	create: FlowViewGraph;
	delete: FlowViewGraph;
	load: FlowViewGraph;
	move: {
		x: number;
		y: number;
		nodeIds: string[];
	}
	/** Keys are node ids, value is updated node text. */
	updateText: Record<string, string>
}>

export type FlowViewChangeEvent = CustomEvent<FlowViewChangeEventDetail> & { target: HTMLFlowViewElement }

declare global {
	interface GlobalEventHandlersEventMap {
		'fv:change': FlowViewChangeEvent
	}
}
