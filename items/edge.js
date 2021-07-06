import { cssVar } from "../theme.js";
import { FlowViewBase } from "./base.js";

export class FlowViewEdge extends FlowViewBase {
  static cssClassName = "fv-edge";
  static width = 2;
  static style = {
    [`.${FlowViewEdge.cssClassName}`]: {
      "display": "inline-block",
      "position": "absolute",
    },
    [`.${FlowViewEdge.cssClassName} line`]: {
      "stroke": cssVar.connectionColor,
      "stroke-width": FlowViewEdge.width,
    },
    [`.${FlowViewEdge.cssClassName} line:hover`]: {
      "stroke": cssVar.connectionColorHighlighted,
    },
  };

  init({ from: [sourceNodeId, sourcePinId], to: [targetNodeId, targetPinId] }) {
    this.sourceNodeId = sourceNodeId;
    this.sourcePinId = sourcePinId;
    this.targetNodeId = targetNodeId;
    this.targetPinId = targetPinId;
  }
}
