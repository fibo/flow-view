export class FlowViewErrorCannotCreateWebComponent extends TypeError {
	constructor() {
		super("flow-view was provided with no valid element nor container");
	}
}

export class FlowViewErrorItemNotFound extends Error {
	constructor({ kind, id }) {
		super(`flow-view ${kind} not found id=${id}`);
	}
}
