import type { FlowViewElement } from './element'

export type Vector = {
	x: number
	y: number
}

export type FlowViewInputObj = {
	id?: string
	name?: string
}

export type SelectorConstructorArg = Vector & {
	nodeList: string[]
	newNode: (text: string) => void
	removeSelector: () => void
	view: {
		origin: Vector
		width: number
		height: number
	}
}

export type FlowViewEdgeObj = {
	id?: string
	from: string[]
	to: string[]
}

export type NodeConstructorArg = Vector & FlowViewNodeSignature & {
	id: string
	view: FlowViewElement
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

export type FlowViewChangeInfo = {
	isClearGraph?: boolean
	isProgrammatic?: boolean
	isLoadGraph?: boolean
}

type FlowViewChange = {
	action: 'CREATE_NODE'
	data: Required<Pick<FlowViewNodeObj, 'id'>> & Pick<FlowViewNodeObj, 'type'>
} | {
	action: 'CREATE_EDGE'
	data: unknown
} | {
	action: 'DELETE_NODE'
	data: unknown
} | {
	action: 'DELETE_EDGE'
	data: unknown
} | {
	action: 'UPDATE_NODE'
	data: unknown
}

export type FlowViewOnChangeCallback = (
	arg: FlowViewChange,
	info?: FlowViewChangeInfo
) => void

