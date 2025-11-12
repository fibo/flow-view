export type Vector = {
	x: number
	y: number
}

export type FlowViewPinPath = [nodeId: string, pinIndex: number]

export type FlowViewGraph = {
	nodes: Record<string, {
		x: number
		y: number
		text: string
	}>
	/**
	 * Keys are targets, values are sources.
	 * Where a target is `nodeId:inputIndex` and a source is `nodeId:ouputIndex`.
	 */
	links?: Record<string, string>
}

export type FlowViewNodeSignature = {
	inputs: Array<{ name?: string }>
	outputs: Array<{ name?: string }>
}
