import { cssVar } from "../theme.js";
import { FlowViewBase } from "./base.js";

export class FlowViewEdge extends FlowViewBase {
  static cssClassName = "fv-edge";
  static width = 2;
  static style = {
    [`.${FlowViewEdge.cssClassName}`]: {
      "display": "inline-block",
      "position": "absolute",
      "border": 0
    },
    [`.${FlowViewEdge.cssClassName} line`]: {
      "stroke": cssVar.connectionColor,
      "stroke-width": FlowViewEdge.width,
    },
    [`.${FlowViewEdge.cssClassName} line:hover`]: {
      "stroke": cssVar.connectionColorHighlighted,
    },
  };

  init({ source, target }) {
    this.source = source
    this.target = target

    const svg = this.svg= this.createSvg('svg')
    this.element.appendChild(svg)

    const line = this.line =this.createSvg('line')
    svg.appendChild(line)
  }

  set dimension([width, height]) {
    const { style, svg } = this;

    style.width = `${width}px`;
    style.height = `${height}px`;

    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
  }

  set position([x, y]) {
    const { style } = this;
    style.top = `${y}px`;
    style.left = `${x}px`;
  }

}
