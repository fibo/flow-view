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

  onPointerup(_event) {
  }
}
