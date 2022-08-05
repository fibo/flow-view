export class FlowViewErrorItemNotFound extends Error {
	constructor({ kind, id }) {
		super(`flow-view ${kind} not found id=${id}`);
	}
}
