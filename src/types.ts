export type Vector = {
  x: number
  y: number
}

export type ViewChangeAction = {
  createdNode: string
  createdEdge: string
  createdSemiEdge: string
  deletedNode: string
  deletedEdge: string
  deletedSemiEdge: string
  updatedNode: string
}

export type ViewChangeInfo = {
  isLoadGraph?: boolean
  isProgrammatic?: boolean
}

export type OnViewChange = (
  action: unknown,
  viewChangeInfo: ViewChangeInfo
) => void

export type Edge = {
  id: string
  from: [sourceNodeId: string, sourcePinId: string]
  to: [targetNodeId: string, targetPinId: string]
}
