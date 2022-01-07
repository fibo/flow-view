import { FlowViewPin } from "./pin.js";

export class FlowViewInput extends FlowViewPin {
  get center() {
    const {
      bounds: { x: boundsX },
      halfPinSize,
      node: { borderWidth, bounds: { x: nodeBoundsX }, position: { x, y } },
    } = this;

    const offsetX = boundsX - nodeBoundsX;

    return {
      x: x + halfPinSize + borderWidth + offsetX,
      y: y + halfPinSize - borderWidth,
    };
  }

  onPointerdown(event) {
    event.stopPropagation();
  }

  onPointerenter(event) {
    event.stopPropagation();

    if (this.view.isDraggingEdge) return;

    this.highlight = true;
  }

  onPointerup() {
    const { view } = this;

    if (view.isDraggingEdge) {
      const { semiEdge } = view;

      if (semiEdge.hasSourcePin) {
        const { source } = semiEdge;
        view.newEdge({ source, target: this });
      }
    }
  }

  toObject() {
    return {
      ...super.toObject(),
    };
  }
}
