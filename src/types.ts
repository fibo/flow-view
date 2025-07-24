import type { FlowView } from './flow-view'

export type Vector = {
	x: number
	y: number
}

export type FlowViewInputObj = {
	id?: string
	name?: string
}

export type FlowViewEdgeObj = {
	id?: string
	from: string[]
	to: string[]
}

export type NodeConstructorArg = Vector & FlowViewNodeSignature & {
	id: string
	view: FlowView
	text: string
	type?: string | undefined
}

export type FlowViewOutputObj = {
	id?: string
	name?: string
}

export type FlowViewNodeObj = {
	x: number
	y: number
	text: string
	id?: string
	type?: string
	ins?: FlowViewInputObj[]
	outs?: FlowViewOutputObj[]
}

export type FlowViewGraph = {
	nodes: FlowViewNodeObj[]
	edges?: FlowViewEdgeObj[]
}

export type FlowViewNodeSignature = Partial<{
	ins: Array<{ name?: string }>
	outs: Array<{ name?: string }>
}>
