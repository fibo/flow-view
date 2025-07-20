import type { FlowViewInput } from './input'
import type { FlowViewOutput } from './output'
import type { FlowViewNode } from './node'
import type { FlowViewElement } from './element'

export type Vector = {
	x: number
	y: number
}

export type FlowViewInputObj = {
	id?: string
	name?: string
}

export type FlowViewBaseConstructorArg = {
	cssClassName: string
	id?: string
	view: FlowViewElement
}

export type FlowViewInputConstructorArg = FlowViewBaseConstructorArg & {
	node: FlowViewNode
}

export type FlowViewEdgeObj = {
	id?: string
	from: string[]
	to: string[]
}

export type FlowViewPinInitArg = {
	name?: string
	node: FlowViewNode
}

export type FlowViewEdgeInitArg = {
	source: FlowViewOutput
	target: FlowViewInput
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

export type FlowViewNodeType = {
	ins: Array<{ name?: string }>
	outs: Array<{ name?: string }>
}

export type FlowViewNodeDefinitions = {
	nodes: Array<{
		name: string
		type?: string
	}>
	types?: Record<string, FlowViewNodeType>
}

export type FlowViewSemiEdge = {
	source?: FlowViewOutput
	target?: FlowViewInput
}

export type FlowViewChangeInfo = {
	isClearGraph?: boolean
	isProgrammatic?: boolean
	isLoadGraph?: boolean
}

type FlowViewChange = {
	action: 'CREATE_NODE'
	data: Required<Pick<FlowViewNodeObj, 'id'>> & Pick<FlowViewNodeObj, 'type'>
} | {
	action: 'DELETE_SEMI_EDGE'
	data: unknown
} | {
	action: 'CREATE_EDGE'
	data: unknown
} | {
	action: 'CREATE_SEMI_EDGE'
	data: unknown
} | {
	action: 'DELETE_NODE'
	data: unknown
} | {
	action: 'UPDATE_NODE'
	data: unknown
}

export type FlowViewOnChangeCallback = (
	arg: FlowViewChange,
	info?: FlowViewChangeInfo
) => void

