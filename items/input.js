import { FlowViewPin } from "./pin.js";

export class FlowViewInput extends FlowViewPin {
  get center() {
    const { halfPinSize, node: { position: { x, y } } } = this;
    return { x: x + halfPinSize, y: y + halfPinSize };
  }
}
