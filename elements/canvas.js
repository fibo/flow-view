import { FlowViewItem } from "./item.js";

export class FlowViewCanvas extends FlowViewItem {
  static customElementName = "fv-canvas";

  constructor() {
    super({
      ":host": {
        "--fv-shadow-color": "rgba(0, 0, 0, 0.17)",
        "display": "block",
        "overflow": "hidden",
        "background-color": "var(--fv-canvas-background-color, #fefefe)",
        "box-shadow": "1px 1px 7px 1px var(--fv-shadow-color)",
        "width": "100%",
        "height": "100%",
        "position": "relative",
      },
    });
  }

  static get observedAttributes() {
    return FlowViewItem.observedAttributes;
  }
}
