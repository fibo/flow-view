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
	links?: Array<{
		from: FlowViewPinPath
		to: FlowViewPinPath
	}>
}

export type FlowViewNodeSignature = {
	inputs: Array<{ name?: string }>
	outputs: Array<{ name?: string }>
}
