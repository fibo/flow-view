import { cssVar } from "../theme.js";
import { FlowViewBase } from "./base.js";

export class FlowViewEdge extends FlowViewBase {
  static cssClassName = "fv-edge";
  static width = 2;
  static style = {
    [`.${FlowViewEdge.cssClassName}`]: {
      "display": "inline-block",
      "position": "absolute",
      "border": 0,
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
    this.source = source;
    this.target = target;

    const svg = this.svg = this.createSvg("svg");
    this.element.appendChild(svg);

    const line = this.line = this.createSvg("line");
    svg.appendChild(line);

    this.updateGeometry();

    this._onPointerdownLine = this.onPointerdownLine.bind(this);
    this.line.addEventListener("pointerdown", this._onPointerdownLine);
  }

  dispose() {
    this.line.removeEventListener("pointerdown", this._onPointerdownLine);
  }

  set start({ x, y }) {
    this.line.setAttribute("x1", Math.round(x));
    this.line.setAttribute("y1", Math.round(y));
  }

  set end({ x, y }) {
    this.line.setAttribute("x2", Math.round(x));
    this.line.setAttribute("y2", Math.round(y));
  }

  set dimension([_width, _height]) {
    const { element: { style }, svg } = this;
    const width = Math.round(_width);
    const height = Math.round(_height);
    style.width = `${width}px`;
    style.height = `${height}px`;
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
  }

  set position({ x, y }) {
    const { element: { style } } = this;
    style.top = `${Math.round(y)}px`;
    style.left = `${Math.round(x)}px`;
  }

  onPointerdownLine() {
    this.view.deleteEdge(this.id);
  }

  onViewOriginUpdate() {
    this.updateGeometry();
  }

  updateGeometry() {
    const {
      source: { center: { x: sourceX, y: sourceY } },
      target: { center: { x: targetX, y: targetY } },
      view: { origin: { x: originX, y: originY } },
    } = this;

    const invertedX = targetX < sourceX;
    const invertedY = targetY < sourceY;

    this.position = {
      x: (invertedX ? targetX : sourceX) - originX,
      y: (invertedY ? targetY : sourceY) - originY,
    };

    const width = Math.abs(targetX - sourceX);
    const height = Math.abs(targetY - sourceY);
    this.dimension = [width, height];

    this.start = {
      x: (invertedX ? width : 0),
      y: (invertedY ? height : 0),
    };

    this.end = {
      x: (invertedX ? 0 : width),
      y: (invertedY ? 0 : height),
    };
  }
}
