import { FlowViewPin } from "./pin.js";

export class FlowViewOutput extends FlowViewPin {
  get center() {
    const {
      halfPinSize,
      node: { borderWidth, bounds: { height }, position: { x, y } },
    } = this;
    return {
      x: x + halfPinSize + borderWidth,
      y: y + height - halfPinSize - borderWidth,
    };
  }
}
