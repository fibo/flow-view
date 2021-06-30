import { FlowViewBase } from './base.js'

export class FlowViewEdge extends FlowViewBase {
  static cssClassName = 'fv-edge'
  static width = 2;
  static style = {
    [`.${FlowViewEdge.cssClassName}`]: {
          "display": "inline-block",
          "position": "absolute",
    },
    [`.${FlowViewEdge.cssClassName} line`]: {
          "stroke": "var(--fv-connection-color)",
          "stroke-width": FlowViewEdge.width,
    },
    [`.${FlowViewEdge.cssClassName} line:hover`]: {
          "stroke": "var(--fv-highlighted-connection-color)",
        },
  }
}
