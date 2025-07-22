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

export type SelectorConstructorArg = {
	position: Vector
	view: FlowViewElement
	element: HTMLElement
	nodeList: string[]
}

export type InputConstructorArg = FlowViewBaseConstructorArg & {
	node: FlowViewNode
}

export type FlowViewEdgeObj = {
	id?: string
	from: string[]
	to: string[]
}

export type EdgeConstructorArg = {
	id: string
	view: FlowViewElement
	source?: FlowViewOutput
	target?: FlowViewInput
}

export type NodeConstructorArg = Vector & FlowViewNodeSignature & {
	id: string
	view: FlowViewElement
	text: string
	type?: string | undefined
}

export type FlowViewPinInitArg = {
	name?: string
	node: FlowViewNode
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

