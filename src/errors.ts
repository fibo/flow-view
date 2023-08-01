export class FlowViewErrorItemNotFound extends Error {
	constructor(kind: string, id: string) {
		super(`flow-view ${kind} not found id=${id}`)
	}
}
