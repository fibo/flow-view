import { FlowViewPin } from "./pin.js";

export class FlowViewOutput extends FlowViewPin {
  get center() {
    const {
      bounds: { x: boundsX },
      halfPinSize,
      node: {
        borderWidth,
        bounds: { height: nodeHeight, x: nodeBoundsX },
        position: { x, y },
      },
    } = this;

    const offsetX = boundsX - nodeBoundsX;

    return {
      x: x + halfPinSize + borderWidth + offsetX,
      y: y + nodeHeight - halfPinSize - borderWidth,
    };
  }

  onPointerdown(event) {
    event.isBubblingFromPin = true;

    this.view.createSemiEdge({ source: this });
  }

  onPointerup(_event) {
  }
}
