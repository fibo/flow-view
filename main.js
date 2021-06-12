export * from "./elements/canvas.js";

import { FlowViewCanvas } from "./elements/canvas.js";

export const flowViewElements = [
  FlowViewCanvas,
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
