export class FlowViewErrorItemNotFound extends Error {
  /** @param {import("../flow-view").FlowViewErrorItemNotFoundConstructorArg} arg */
  constructor({ kind, id }) {
    super(`flow-view ${kind} not found id=${id}`)
  }
}
