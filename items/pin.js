import { cssVar } from "../theme.js";
import { FlowViewBase } from "./base.js";

export class FlowViewPin extends FlowViewBase {
  static cssClassName = "fv-pin";
  static size = 10;

  static style = {
    [`.${FlowViewPin.cssClassName}`]: {
      "background-color": cssVar.connectionColor,
      "display": "block",
      "width": `${FlowViewPin.size}px`,
      "height": `${FlowViewPin.size}px`,
    },
    [`.${FlowViewPin.cssClassName}:hover`]: {
      "background-color": cssVar.connectionColorHighlighted,
    },
  };
}
