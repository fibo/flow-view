export * from "./elements/canvas.js";
export * from "./elements/link.js";
export * from "./elements/node.js";
export * from "./elements/pin.js";

import { FlowViewCanvas } from "./elements/canvas.js";
import { FlowViewLink } from "./elements/link.js";
import { FlowViewNode } from "./elements/node.js";
import { FlowViewPin } from "./elements/pin.js";

export const flowViewElements = [
  FlowViewCanvas,
  FlowViewLink,
  FlowViewNode,
  FlowViewPin,
];

export function flowViewInit(elementDefinitions = flowViewElements) {
  elementDefinitions.forEach((customElementClass) => {
    const { customElementName } = customElementClass;

    if (customElements.get(customElementName)) {
      console.error(`Custom element already defined: ${customElementName}`);
    } else {
      customElements.define(customElementName, customElementClass);
    }
  });
}
