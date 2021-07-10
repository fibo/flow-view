import { cssModifierHighlighted, cssTransition, cssVar } from "../theme.js";
import { FlowViewBase } from "./base.js";

export class FlowViewEdge extends FlowViewBase {
  static cssClassName = "fv-edge";
  static lineWidth = 2;
  static padding = 1;
  static zIndex = 0;
  static style = {
    [`.${FlowViewEdge.cssClassName}`]: {
      "display": "inline-block",
      "position": "absolute",
      "border": 0,
      "pointer-events": "none",
    },
    [`.${FlowViewEdge.cssClassName} line`]: {
      "pointer-events": "all",
      "stroke": cssVar.connectionColor,
      "stroke-width": FlowViewEdge.lineWidth,
      ...cssTransition("stroke"),
    },
    [`.${cssModifierHighlighted(FlowViewEdge.cssClassName)} line`]: {
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
    line.addEventListener("pointerdown", this._onPointerdownLine);
    this._onPointerenterLine = this.onPointerenterLine.bind(this);
    line.addEventListener("pointerenter", this._onPointerenterLine);
    this._onPointerleaveLine = this.onPointerleaveLine.bind(this);
    line.addEventListener("pointerleave", this._onPointerleaveLine);
  }

  dispose() {
    const { line } = this;
    line.removeEventListener("pointerdown", this._onPointerdownLine);
    line.removeEventListener("pointerenter", this._onPointerenterLine);
    line.removeEventListener("pointerleave", this._onPointerleaveLine);
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
    const { padding } = FlowViewEdge;
    const { element: { style }, svg } = this;

    const width = _width + padding * 2;
    const height = _height + padding * 2;

    style.width = `${width}px`;
    style.height = `${height}px`;
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
  }

  set position({ x, y }) {
    const { padding } = FlowViewEdge;
    const { element: { style } } = this;
    style.top = `${Math.round(y) - padding}px`;
    style.left = `${Math.round(x) - padding}px`;
  }

  onPointerdownLine(event) {
    event.stopPropagation();

    const isMultiSelection = event.shiftKey;
    if (!isMultiSelection) {
      this.view.clearSelection();
    }
    this.view.selectEdge(this);
  }

  onPointerenterLine() {
    if (!this.isSelected) {
      this.highlight = true;
      this.source.highlight = true;
      this.target.highlight = true;
    }
  }

  onPointerleaveLine() {
    if (!this.isSelected) {
      this.highlight = false;
      if (!this.source.node.isSelected) {
        this.source.highlight = false;
      }
      if (!this.target.node.isSelected) {
        this.target.highlight = false;
      }
    }
  }

  updateGeometry() {
    const { lineWidth, padding } = FlowViewEdge;
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

    const width = Math.max(Math.abs(Math.round(targetX - sourceX)), lineWidth);
    const height = Math.max(Math.abs(Math.round(targetY - sourceY)), lineWidth);
    this.dimension = [width, height];

    this.start = {
      x: (invertedX ? width : 0) + padding,
      y: (invertedY ? height : 0) + padding,
    };

    this.end = {
      x: (invertedX ? 0 : width) + padding,
      y: (invertedY ? 0 : height) + padding,
    };
  }
}
