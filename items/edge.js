import { cssModifierHighlighted, cssTransition, cssVar } from "../theme.js";
import { FlowViewBase } from "./base.js";
import { FlowViewInput } from "./input.js";
import { FlowViewOutput } from "./output.js";

export class FlowViewEdge extends FlowViewBase {
  static cssClassName = "fv-edge";
  static lineWidth = 2;
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

  get hasSourcePin() {
    return this.source instanceof FlowViewOutput;
  }

  get hasTargetPin() {
    return this.target instanceof FlowViewInput;
  }

  get isSemiEdge() {
    return !this.hasTargetPin || !this.hasSourcePin;
  }

  init({ source, target }) {
    const hasSourcePin = source instanceof FlowViewOutput;
    const hasTargetPin = target instanceof FlowViewInput;

    this.source = (hasTargetPin && !hasSourcePin)
      ? { center: { x: target.center.x, y: target.center.y } }
      : source;
    this.target = (hasSourcePin && !hasTargetPin)
      ? { center: { x: source.center.x, y: source.center.y } }
      : target;

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
    const { lineWidth } = FlowViewEdge;
    const { element: { style }, svg } = this;

    const width = Math.max(_width, lineWidth);
    const height = Math.max(_height, lineWidth);

    style.width = `${width}px`;
    style.height = `${height}px`;
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
  }

  set position({ x, y }) {
    const { element: { style } } = this;
    style.top = `${y}px`;
    style.left = `${x}px`;
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
    if (this.isSemiEdge) return;
    if (this.view.isDraggingEdge) return;

    if (!this.isSelected) {
      this.highlight = true;
      this.source.highlight = true;
      this.target.highlight = true;
    }
  }

  onPointerleaveLine() {
    if (this.isSemiEdge) return;

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
    const {
      source: { center: { x: sourceX, y: sourceY } },
      target: { center: { x: targetX, y: targetY } },
      view: { origin: { x: originX, y: originY } },
    } = this;

    const invertedX = targetX < sourceX;
    const invertedY = targetY < sourceY;

    this.position = {
      x: Math.round((invertedX ? targetX : sourceX) - originX),
      y: Math.round((invertedY ? targetY : sourceY) - originY),
    };

    const width = Math.abs(Math.round(targetX - sourceX));
    const height = Math.abs(Math.round(targetY - sourceY));
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

  toObject() {
    const { isSemiEdge, source, target } = this;

    if (isSemiEdge) return;

    const sourceNodeId = source.node.id;
    const sourcePinId = source.id;
    const targetNodeId = target.node.id;
    const targetPinId = target.id;
    return {
      ...super.toObject(),
      from: [sourceNodeId, sourcePinId],
      to: [targetNodeId, targetPinId],
    };
  }
}
